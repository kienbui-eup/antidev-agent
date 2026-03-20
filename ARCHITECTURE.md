# Kiến trúc

Tài liệu này giải thích **lý do** antidev được xây dựng theo cách này. Để biết cách cài đặt và các lệnh, xem CLAUDE.md. Để biết cách đóng góp, xem CONTRIBUTING.md.

## Ý tưởng cốt lõi

antidev cung cấp cho Claude Code một trình duyệt liên tục và một bộ kỹ năng quy trình làm việc được thiết kế sẵn. Phần trình duyệt là phần khó nhất — mọi thứ còn lại chỉ là Markdown.

Điểm mấu chốt: một AI agent tương tác với trình duyệt cần **độ trễ dưới một giây** và **trạng thái liên tục**. Nếu mỗi lệnh khởi động trình duyệt từ đầu, bạn sẽ phải chờ 3-5 giây mỗi lần gọi công cụ. Nếu trình duyệt bị tắt giữa các lệnh, bạn mất cookie, tab và phiên đăng nhập. Vì vậy antidev chạy một Chromium daemon lâu dài mà CLI giao tiếp qua localhost HTTP.

```
Claude Code                     antidev
─────────                      ──────
                               ┌──────────────────────┐
  Tool call: $B snapshot -i    │  CLI (compiled binary)│
  ─────────────────────────→   │  • reads state file   │
                               │  • POST /command      │
                               │    to localhost:PORT   │
                               └──────────┬───────────┘
                                          │ HTTP
                               ┌──────────▼───────────┐
                               │  Server (Bun.serve)   │
                               │  • dispatches command  │
                               │  • talks to Chromium   │
                               │  • returns plain text  │
                               └──────────┬───────────┘
                                          │ CDP
                               ┌──────────▼───────────┐
                               │  Chromium (headless)   │
                               │  • persistent tabs     │
                               │  • cookies carry over  │
                               │  • 30min idle timeout  │
                               └───────────────────────┘
```

Lần gọi đầu tiên khởi động mọi thứ (~3s). Mỗi lần gọi sau: ~100-200ms.

## Tại sao dùng Bun

Node.js cũng hoạt động được. Bun tốt hơn ở đây vì ba lý do:

1. **Binary được biên dịch sẵn.** `bun build --compile` tạo ra một file thực thi đơn ~58MB. Không cần `node_modules` khi chạy, không cần `npx`, không cần cấu hình PATH. Binary chỉ cần chạy là xong. Điều này quan trọng vì antidev cài vào `~/.claude/skills/` nơi người dùng không muốn quản lý một project Node.js.

2. **SQLite gốc.** Giải mã cookie đọc trực tiếp cơ sở dữ liệu SQLite cookie của Chromium. Bun có `new Database()` tích hợp sẵn — không cần `better-sqlite3`, không cần biên dịch addon gốc, không cần gyp. Ít thứ bị hỏng hơn trên các máy khác nhau.

3. **TypeScript gốc.** Server chạy dưới dạng `bun run server.ts` trong quá trình phát triển. Không cần bước biên dịch, không cần `ts-node`, không cần source map để debug. Binary được biên dịch là dành cho triển khai; file nguồn là dành cho phát triển.

4. **HTTP server tích hợp.** `Bun.serve()` nhanh, đơn giản và không cần Express hay Fastify. Server xử lý tổng cộng ~10 route. Một framework sẽ là overhead không cần thiết.

Điểm nghẽn cổ chai luôn là Chromium, không phải CLI hay server. Tốc độ khởi động của Bun (~1ms cho binary đã biên dịch so với ~100ms của Node) thì tốt nhưng không phải lý do chúng tôi chọn nó. Binary đã biên dịch và SQLite gốc mới là lý do.

## Mô hình daemon

### Tại sao không khởi động trình duyệt mỗi lệnh?

Playwright có thể khởi chạy Chromium trong ~2-3 giây. Đối với một screenshot đơn lẻ, điều đó ổn. Đối với một phiên QA với 20+ lệnh, đó là 40+ giây overhead khởi động trình duyệt. Tệ hơn: bạn mất toàn bộ trạng thái giữa các lệnh. Cookie, localStorage, phiên đăng nhập, các tab đang mở — tất cả biến mất.

Mô hình daemon có nghĩa là:

- **Trạng thái liên tục.** Đăng nhập một lần, duy trì đăng nhập. Mở một tab, nó vẫn còn đó. localStorage tồn tại xuyên suốt các lệnh.
- **Lệnh dưới một giây.** Sau lần gọi đầu tiên, mỗi lệnh chỉ là một HTTP POST. ~100-200ms khứ hồi bao gồm cả công việc của Chromium.
- **Vòng đời tự động.** Server tự khởi động lần đầu sử dụng, tự tắt sau 30 phút không hoạt động. Không cần quản lý tiến trình.

### File trạng thái

Server ghi `.antidev/browse.json` (ghi nguyên tử qua tmp + đổi tên, mode 0o600):

```json
{ "pid": 12345, "port": 34567, "token": "uuid-v4", "startedAt": "...", "binaryVersion": "abc123" }
```

CLI đọc file này để tìm server. Nếu file bị thiếu, cũ, hoặc PID đã chết, CLI tạo một server mới.

### Chọn cổng (port)

Cổng ngẫu nhiên trong khoảng 10000-60000 (thử lại tối đa 5 lần khi xung đột). Điều này có nghĩa là 10 workspace Conductor có thể mỗi cái chạy browse daemon của riêng mình mà không cần cấu hình và không xung đột cổng. Cách tiếp cận cũ (quét 9400-9409) liên tục bị lỗi trong các thiết lập đa workspace.

### Tự động khởi động lại theo phiên bản

Quá trình build ghi `git rev-parse HEAD` vào `browse/dist/.version`. Mỗi lần CLI được gọi, nếu phiên bản binary không khớp với `binaryVersion` của server đang chạy, CLI sẽ tắt server cũ và khởi động server mới. Điều này ngăn chặn hoàn toàn lớp lỗi "binary cũ" — rebuild binary, lệnh tiếp theo sẽ tự động sử dụng nó.

## Mô hình bảo mật

### Chỉ localhost

HTTP server bind vào `localhost`, không phải `0.0.0.0`. Không thể truy cập từ mạng bên ngoài.

### Xác thực bearer token

Mỗi phiên server tạo một UUID token ngẫu nhiên, được ghi vào file trạng thái với mode 0o600 (chỉ chủ sở hữu đọc được). Mỗi HTTP request phải bao gồm `Authorization: Bearer <token>`. Nếu token không khớp, server trả về 401.

Điều này ngăn các tiến trình khác trên cùng máy nói chuyện với browse server của bạn. Cookie picker UI (`/cookie-picker`) và health check (`/health`) được miễn — chúng chỉ là localhost và không thực thi lệnh.

### Bảo mật cookie

Cookie là dữ liệu nhạy cảm nhất mà antidev xử lý. Thiết kế:

1. **Truy cập Keychain yêu cầu phê duyệt người dùng.** Lần đầu import cookie cho mỗi trình duyệt kích hoạt hộp thoại macOS Keychain. Người dùng phải nhấp "Allow" hoặc "Always Allow." antidev không bao giờ truy cập thông tin xác thực một cách lặng lẽ.

2. **Giải mã xảy ra trong tiến trình.** Giá trị cookie được giải mã trong bộ nhớ (PBKDF2 + AES-128-CBC), tải vào Playwright context, và không bao giờ ghi ra đĩa ở dạng plaintext. Cookie picker UI không bao giờ hiển thị giá trị cookie — chỉ tên miền và số lượng.

3. **Cơ sở dữ liệu chỉ đọc.** antidev sao chép Chromium cookie DB sang file tạm (để tránh xung đột SQLite lock với trình duyệt đang chạy) và mở ở chế độ chỉ đọc. Nó không bao giờ chỉnh sửa cơ sở dữ liệu cookie thực của trình duyệt bạn.

4. **Cache key theo phiên.** Mật khẩu Keychain + AES key dẫn xuất được cache trong bộ nhớ cho suốt thời gian sống của server. Khi server tắt (idle timeout hoặc dừng tường minh), cache bị xóa.

5. **Không có giá trị cookie trong logs.** Các log console, network, và dialog không bao giờ chứa giá trị cookie. Lệnh `cookies` xuất metadata cookie (domain, name, expiry) nhưng các giá trị bị cắt bớt.

### Ngăn chặn shell injection

Registry trình duyệt (Comet, Chrome, Arc, Brave, Edge) được hardcode. Đường dẫn cơ sở dữ liệu được xây dựng từ các hằng số đã biết, không bao giờ từ dữ liệu người dùng nhập vào. Truy cập Keychain sử dụng `Bun.spawn()` với mảng tham số tường minh, không dùng nội suy chuỗi shell.

## Hệ thống ref

Các ref (`@e1`, `@e2`, `@c1`) là cách agent đánh địa chỉ các phần tử trang mà không cần viết CSS selector hay XPath.

### Cách hoạt động

```
1. Agent runs: $B snapshot -i
2. Server calls Playwright's page.accessibility.snapshot()
3. Parser walks the ARIA tree, assigns sequential refs: @e1, @e2, @e3...
4. For each ref, builds a Playwright Locator: getByRole(role, { name }).nth(index)
5. Stores Map<string, RefEntry> on the BrowserManager instance (role + name + Locator)
6. Returns the annotated tree as plain text

Later:
7. Agent runs: $B click @e3
8. Server resolves @e3 → Locator → locator.click()
```

### Tại sao dùng Locator, không phải thay đổi DOM

Cách tiếp cận rõ ràng là inject thuộc tính `data-ref="@e1"` vào DOM. Điều này bị hỏng khi:

- **CSP (Content Security Policy).** Nhiều trang production chặn chỉnh sửa DOM từ script.
- **React/Vue/Svelte hydration.** Framework reconciliation có thể loại bỏ các thuộc tính đã inject.
- **Shadow DOM.** Không thể tiếp cận bên trong shadow root từ bên ngoài.

Playwright Locator là bên ngoài DOM. Chúng sử dụng accessibility tree (mà Chromium duy trì nội bộ) và các truy vấn `getByRole()`. Không thay đổi DOM, không có vấn đề CSP, không có xung đột framework.

### Vòng đời ref

Ref được xóa khi điều hướng (sự kiện `framenavigated` trên frame chính). Điều này đúng — sau khi điều hướng, tất cả locator đều cũ. Agent phải chạy `snapshot` lại để lấy ref mới. Đây là thiết kế có chủ đích: ref cũ nên thất bại to tiếng, không nhấp vào phần tử sai.

### Phát hiện ref cũ

SPA có thể thay đổi DOM mà không kích hoạt `framenavigated` (ví dụ: chuyển trang React router, chuyển tab, mở modal). Điều này làm ref trở nên cũ ngay cả khi URL trang không thay đổi. Để phát hiện điều này, `resolveRef()` thực hiện kiểm tra `count()` bất đồng bộ trước khi sử dụng bất kỳ ref nào:

```
resolveRef(@e3) → entry = refMap.get("e3")
                → count = await entry.locator.count()
                → if count === 0: throw "Ref @e3 is stale — element no longer exists. Run 'snapshot' to get fresh refs."
                → if count > 0: return { locator }
```

Điều này thất bại nhanh (~5ms overhead) thay vì để timeout hành động 30 giây của Playwright hết hạn với một phần tử bị thiếu. `RefEntry` lưu metadata `role` và `name` bên cạnh Locator để thông báo lỗi có thể cho agent biết phần tử đó là gì.

### Ref cursor-interactive (@c)

Flag `-C` tìm các phần tử có thể nhấp nhưng không có trong cây ARIA — những thứ được style với `cursor: pointer`, phần tử có thuộc tính `onclick`, hoặc `tabindex` tùy chỉnh. Những phần tử này nhận ref `@c1`, `@c2` trong một namespace riêng. Điều này bắt được các component tùy chỉnh mà framework render dưới dạng `<div>` nhưng thực ra là nút bấm.

## Kiến trúc logging

Ba ring buffer (50.000 entry mỗi cái, O(1) push):

```
Browser events → CircularBuffer (in-memory) → Async flush to .antidev/*.log
```

Tin nhắn console, yêu cầu network, và sự kiện dialog mỗi loại có buffer riêng. Flush xảy ra mỗi 1 giây — server chỉ append các entry mới kể từ lần flush cuối. Điều này có nghĩa là:

- Xử lý HTTP request không bao giờ bị chặn bởi disk I/O
- Log tồn tại khi server crash (tối đa mất 1 giây dữ liệu)
- Bộ nhớ bị giới hạn (50K entry × 3 buffer)
- File trên đĩa là append-only, đọc được bằng các công cụ bên ngoài

Các lệnh `console`, `network`, và `dialog` đọc từ buffer trong bộ nhớ, không phải đĩa. File trên đĩa dùng để debug sau sự cố.

## Hệ thống template SKILL.md

### Vấn đề

Các file SKILL.md nói với Claude cách sử dụng các lệnh browse. Nếu tài liệu liệt kê một flag không tồn tại, hoặc bỏ sót một lệnh vừa được thêm vào, agent sẽ gặp lỗi. Tài liệu được duy trì thủ công luôn bị lệch so với code.

### Giải pháp

```
SKILL.md.tmpl          (văn xuôi do người viết + placeholder)
       ↓
gen-skill-docs.ts      (đọc metadata từ source code)
       ↓
SKILL.md               (đã commit, các phần được tạo tự động)
```

Template chứa các quy trình làm việc, mẹo và ví dụ cần có sự phán đoán của con người. Placeholder được điền từ source code lúc build:

| Placeholder | Nguồn | Tạo ra gì |
|-------------|--------|-------------------|
| `{{COMMAND_REFERENCE}}` | `commands.ts` | Bảng lệnh theo danh mục |
| `{{SNAPSHOT_FLAGS}}` | `snapshot.ts` | Tham khảo flag với ví dụ |
| `{{PREAMBLE}}` | `gen-skill-docs.ts` | Khối khởi động: kiểm tra cập nhật, theo dõi phiên, chế độ contributor, định dạng AskUserQuestion |
| `{{BROWSE_SETUP}}` | `gen-skill-docs.ts` | Khám phá binary + hướng dẫn cài đặt |
| `{{BASE_BRANCH_DETECT}}` | `gen-skill-docs.ts` | Phát hiện nhánh base động cho các skill nhắm vào PR (ship, review, qa, plan-ceo-review) |
| `{{QA_METHODOLOGY}}` | `gen-skill-docs.ts` | Khối phương pháp QA dùng chung cho /qa và /qa-only |
| `{{DESIGN_METHODOLOGY}}` | `gen-skill-docs.ts` | Phương pháp kiểm tra thiết kế dùng chung cho /plan-design-review và /design-review |
| `{{REVIEW_DASHBOARD}}` | `gen-skill-docs.ts` | Review Readiness Dashboard cho /ship pre-flight |
| `{{TEST_BOOTSTRAP}}` | `gen-skill-docs.ts` | Phát hiện framework test, bootstrap, cài đặt CI/CD cho /qa, /ship, /design-review |

Điều này vững chắc về mặt cấu trúc — nếu một lệnh tồn tại trong code, nó xuất hiện trong tài liệu. Nếu không tồn tại, nó không thể xuất hiện.

### Preamble

Mỗi skill bắt đầu với một khối `{{PREAMBLE}}` chạy trước logic riêng của skill. Nó xử lý bốn thứ trong một lệnh bash duy nhất:

1. **Kiểm tra cập nhật** — gọi `antidev-update-check`, báo cáo nếu có bản nâng cấp.
2. **Theo dõi phiên** — touch `~/.antidev/sessions/$PPID` và đếm các phiên đang hoạt động (các file được chỉnh sửa trong 2 giờ qua). Khi 3+ phiên đang chạy, tất cả skill vào "chế độ ELI16" — mỗi câu hỏi định vị lại người dùng về ngữ cảnh vì họ đang xử lý nhiều cửa sổ.
3. **Chế độ contributor** — đọc `antidev_contributor` từ config. Khi true, agent ghi các báo cáo thực địa thông thường vào `~/.antidev/contributor-logs/` khi antidev bản thân hoạt động không đúng.
4. **Định dạng AskUserQuestion** — định dạng phổ quát: ngữ cảnh, câu hỏi, `RECOMMENDATION: Choose X because ___`, các lựa chọn theo chữ cái. Nhất quán trên tất cả skill.

### Tại sao committed, không được tạo lúc runtime?

Ba lý do:

1. **Claude đọc SKILL.md lúc tải skill.** Không có bước build khi người dùng gọi `/browse`. File phải đã tồn tại và đúng.
2. **CI có thể xác thực tính tươi mới.** `gen:skill-docs --dry-run` + `git diff --exit-code` phát hiện tài liệu cũ trước khi merge.
3. **Git blame hoạt động.** Bạn có thể thấy khi nào một lệnh được thêm vào và trong commit nào.

### Các tầng kiểm tra template

| Tầng | Nội dung | Chi phí | Tốc độ |
|------|------|------|-------|
| 1 — Xác thực tĩnh | Phân tích mọi lệnh `$B` trong SKILL.md, xác thực với registry | Miễn phí | <2s |
| 2 — E2E qua `claude -p` | Tạo phiên Claude thực, chạy mỗi skill, kiểm tra lỗi | ~$3.85 | ~20 phút |
| 3 — LLM-as-judge | Sonnet chấm điểm tài liệu về tính rõ ràng/đầy đủ/khả năng hành động | ~$0.15 | ~30s |

Tầng 1 chạy mỗi lần `bun test`. Tầng 2+3 được chặn sau `EVALS=1`. Ý tưởng là: phát hiện 95% vấn đề miễn phí, dùng LLM chỉ cho những phán đoán.

## Điều phối lệnh

Các lệnh được phân loại theo side effect:

- **READ** (text, html, links, console, cookies, ...): Không thay đổi trạng thái. An toàn để thử lại. Trả về trạng thái trang.
- **WRITE** (goto, click, fill, press, ...): Thay đổi trạng thái trang. Không idempotent.
- **META** (snapshot, screenshot, tabs, chain, ...): Các thao tác cấp server không phù hợp gọn vào read/write.

Đây không chỉ là tổ chức. Server dùng nó để điều phối:

```typescript
if (READ_COMMANDS.has(cmd))  → handleReadCommand(cmd, args, bm)
if (WRITE_COMMANDS.has(cmd)) → handleWriteCommand(cmd, args, bm)
if (META_COMMANDS.has(cmd))  → handleMetaCommand(cmd, args, bm, shutdown)
```

Lệnh `help` trả về cả ba tập để agent có thể tự khám phá các lệnh có sẵn.

## Triết lý xử lý lỗi

Lỗi dành cho AI agent, không phải con người. Mỗi thông báo lỗi phải có thể hành động được:

- "Element not found" → "Element not found or not interactable. Run `snapshot -i` to see available elements."
- "Selector matched multiple elements" → "Selector matched multiple elements. Use @refs from `snapshot` instead."
- Timeout → "Navigation timed out after 30s. The page may be slow or the URL may be wrong."

Lỗi gốc của Playwright được viết lại qua `wrapError()` để loại bỏ stack trace nội bộ và thêm hướng dẫn. Agent phải có thể đọc lỗi và biết phải làm gì tiếp theo mà không cần can thiệp của con người.

### Khôi phục sau crash

Server không cố tự phục hồi. Nếu Chromium crash (`browser.on('disconnected')`), server thoát ngay lập tức. CLI phát hiện server chết ở lệnh tiếp theo và tự động khởi động lại. Điều này đơn giản hơn và đáng tin cậy hơn so với việc cố kết nối lại với một tiến trình trình duyệt nửa chết.

## Cơ sở hạ tầng kiểm tra E2E

### Session runner (`test/helpers/session-runner.ts`)

Các bài kiểm tra E2E tạo `claude -p` như một subprocess hoàn toàn độc lập — không qua Agent SDK vì không thể lồng trong các phiên Claude Code. Runner:

1. Ghi prompt vào file tạm (tránh vấn đề escape shell)
2. Tạo `sh -c 'cat prompt | claude -p --output-format stream-json --verbose'`
3. Stream NDJSON từ stdout để theo dõi tiến trình thời gian thực
4. Tranh đua với timeout có thể cấu hình
5. Phân tích bản ghi NDJSON đầy đủ thành kết quả có cấu trúc

Hàm `parseNDJSON()` là thuần túy — không có I/O, không có side effect — làm cho nó có thể kiểm tra độc lập.

### Luồng dữ liệu quan sát

```
  skill-e2e.test.ts
        │
        │ generates runId, passes testName + runId to each call
        │
  ┌─────┼──────────────────────────────┐
  │     │                              │
  │  runSkillTest()              evalCollector
  │  (session-runner.ts)         (eval-store.ts)
  │     │                              │
  │  per tool call:              per addTest():
  │  ┌──┼──────────┐              savePartial()
  │  │  │          │                   │
  │  ▼  ▼          ▼                   ▼
  │ [HB] [PL]    [NJ]          _partial-e2e.json
  │  │    │        │             (atomic overwrite)
  │  │    │        │
  │  ▼    ▼        ▼
  │ e2e-  prog-  {name}
  │ live  ress   .ndjson
  │ .json .log
  │
  │  on failure:
  │  {name}-failure.json
  │
  │  ALL files in ~/.antidev-dev/
  │  Run dir: e2e-runs/{runId}/
  │
  │         eval-watch.ts
  │              │
  │        ┌─────┴─────┐
  │     read HB     read partial
  │        └─────┬─────┘
  │              ▼
  │        render dashboard
  │        (stale >10min? warn)
```

**Sở hữu phân tách:** session-runner sở hữu heartbeat (trạng thái kiểm tra hiện tại), eval-store sở hữu kết quả một phần (trạng thái kiểm tra đã hoàn thành). Watcher đọc cả hai. Không component nào biết về component kia — chúng chia sẻ dữ liệu chỉ qua filesystem.

**Không có gì là fatal:** Tất cả I/O quan sát được bọc trong try/catch. Lỗi ghi không bao giờ khiến bài kiểm tra thất bại. Bản thân các bài kiểm tra mới là nguồn sự thật; quan sát là best-effort.

**Chẩn đoán có thể đọc máy:** Mỗi kết quả bài kiểm tra bao gồm `exit_reason` (success, timeout, error_max_turns, error_api, exit_code_N), `timeout_at_turn`, và `last_tool_call`. Điều này cho phép các truy vấn `jq` như:
```bash
jq '.tests[] | select(.exit_reason == "timeout") | .last_tool_call' ~/.antidev-dev/evals/_partial-e2e.json
```

### Lưu trữ eval (`test/helpers/eval-store.ts`)

`EvalCollector` tích lũy kết quả bài kiểm tra và ghi chúng theo hai cách:

1. **Tăng dần:** `savePartial()` ghi `_partial-e2e.json` sau mỗi bài kiểm tra (nguyên tử: ghi `.tmp`, `fs.renameSync`). Tồn tại qua các lần kill.
2. **Cuối cùng:** `finalize()` ghi file eval có timestamp (ví dụ `e2e-20260314-143022.json`). File partial không bao giờ bị dọn dẹp — nó tồn tại cùng với file cuối cùng để quan sát.

`eval:compare` diff hai lần chạy eval. `eval:summary` tổng hợp thống kê trên tất cả các lần chạy trong `~/.antidev-dev/evals/`.

### Các tầng bài kiểm tra

| Tầng | Nội dung | Chi phí | Tốc độ |
|------|------|------|-------|
| 1 — Xác thực tĩnh | Phân tích lệnh `$B`, xác thực với registry, unit test quan sát | Miễn phí | <5s |
| 2 — E2E qua `claude -p` | Tạo phiên Claude thực, chạy mỗi skill, quét lỗi | ~$3.85 | ~20 phút |
| 3 — LLM-as-judge | Sonnet chấm điểm tài liệu về tính rõ ràng/đầy đủ/khả năng hành động | ~$0.15 | ~30s |

Tầng 1 chạy mỗi lần `bun test`. Tầng 2+3 được chặn sau `EVALS=1`. Ý tưởng: phát hiện 95% vấn đề miễn phí, dùng LLM chỉ cho những phán đoán và kiểm tra tích hợp.

## Những gì cố ý không có ở đây

- **Không có WebSocket streaming.** HTTP request/response đơn giản hơn, dễ debug với curl, và đủ nhanh. Streaming sẽ tăng thêm độ phức tạp với lợi ích không đáng kể.
- **Không có giao thức MCP.** MCP thêm overhead JSON schema mỗi request và yêu cầu kết nối liên tục. HTTP thuần + plain text output nhẹ hơn về token và dễ debug hơn.
- **Không hỗ trợ đa người dùng.** Một server mỗi workspace, một người dùng. Token auth là phòng thủ theo chiều sâu, không phải multi-tenancy.
- **Không có giải mã cookie Windows/Linux.** macOS Keychain là kho lưu thông tin xác thực duy nhất được hỗ trợ. Linux (GNOME Keyring/kwallet) và Windows (DPAPI) có thể thực hiện về mặt kiến trúc nhưng chưa được triển khai.
- **Không có hỗ trợ iframe.** Playwright có thể xử lý iframe nhưng hệ thống ref chưa vượt qua ranh giới frame. Đây là tính năng bị thiếu được yêu cầu nhiều nhất.

# Trình duyệt — chi tiết kỹ thuật

Tài liệu này bao gồm tham khảo lệnh và nội bộ của trình duyệt headless của antidev.

## Tham khảo lệnh

| Danh mục | Lệnh | Dùng để làm gì |
|----------|----------|----------|
| Điều hướng | `goto`, `back`, `forward`, `reload`, `url` | Đến một trang |
| Đọc | `text`, `html`, `links`, `forms`, `accessibility` | Trích xuất nội dung |
| Snapshot | `snapshot [-i] [-c] [-d N] [-s sel] [-D] [-a] [-o] [-C]` | Lấy ref, diff, chú thích |
| Tương tác | `click`, `fill`, `select`, `hover`, `type`, `press`, `scroll`, `wait`, `viewport`, `upload` | Sử dụng trang |
| Kiểm tra | `js`, `eval`, `css`, `attrs`, `is`, `console`, `network`, `dialog`, `cookies`, `storage`, `perf` | Debug và xác minh |
| Hình ảnh | `screenshot [--viewport] [--clip x,y,w,h] [sel\|@ref] [path]`, `pdf`, `responsive` | Xem Claude thấy gì |
| So sánh | `diff <url1> <url2>` | Phát hiện sự khác biệt giữa các môi trường |
| Hộp thoại | `dialog-accept [text]`, `dialog-dismiss` | Kiểm soát xử lý alert/confirm/prompt |
| Tab | `tabs`, `tab`, `newtab`, `closetab` | Quy trình làm việc nhiều trang |
| Cookie | `cookie-import`, `cookie-import-browser` | Import cookie từ file hoặc trình duyệt thực |
| Nhiều bước | `chain` (JSON từ stdin) | Gộp lệnh trong một lần gọi |
| Bàn giao | `handoff [reason]`, `resume` | Chuyển sang Chrome hiển thị để người dùng tiếp quản |

Tất cả tham số selector chấp nhận CSS selector, ref `@e` sau `snapshot`, hoặc ref `@c` sau `snapshot -C`. Tổng cộng hơn 50 lệnh cộng với import cookie.

## Cách hoạt động

Trình duyệt của antidev là một binary CLI được biên dịch giao tiếp với một Chromium daemon cục bộ liên tục qua HTTP. CLI là một client mỏng — nó đọc một file trạng thái, gửi một lệnh, và in kết quả ra stdout. Server thực hiện công việc thực qua [Playwright](https://playwright.dev/).

```
┌─────────────────────────────────────────────────────────────────┐
│  Claude Code                                                    │
│                                                                 │
│  "browse goto https://staging.myapp.com"                        │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐    HTTP POST     ┌──────────────┐                 │
│  │ browse   │ ──────────────── │ Bun HTTP     │                 │
│  │ CLI      │  localhost:rand  │ server       │                 │
│  │          │  Bearer token    │              │                 │
│  │ compiled │ ◄──────────────  │  Playwright  │──── Chromium    │
│  │ binary   │  plain text      │  API calls   │    (headless)   │
│  └──────────┘                  └──────────────┘                 │
│   ~1ms startup                  persistent daemon               │
│                                 auto-starts on first call       │
│                                 auto-stops after 30 min idle    │
└─────────────────────────────────────────────────────────────────┘
```

### Vòng đời

1. **Lần gọi đầu tiên**: CLI kiểm tra `.antidev/browse.json` (trong thư mục gốc project) để tìm server đang chạy. Không tìm thấy — nó tạo `bun run browse/src/server.ts` ở nền. Server khởi chạy headless Chromium qua Playwright, chọn cổng ngẫu nhiên (10000-60000), tạo bearer token, ghi file trạng thái, và bắt đầu nhận HTTP request. Quá trình này mất ~3 giây.

2. **Các lần gọi tiếp theo**: CLI đọc file trạng thái, gửi HTTP POST với bearer token, in kết quả. ~100-200ms khứ hồi.

3. **Tắt khi không hoạt động**: Sau 30 phút không có lệnh nào, server tắt và dọn dẹp file trạng thái. Lần gọi tiếp theo tự động khởi động lại.

4. **Khôi phục sau crash**: Nếu Chromium crash, server thoát ngay lập tức (không tự phục hồi — không che giấu thất bại). CLI phát hiện server chết ở lần gọi tiếp theo và khởi động một server mới.

### Các thành phần chính

```
browse/
├── src/
│   ├── cli.ts              # Thin client — reads state file, sends HTTP, prints response
│   ├── server.ts           # Bun.serve HTTP server — routes commands to Playwright
│   ├── browser-manager.ts  # Chromium lifecycle — launch, tabs, ref map, crash handling
│   ├── snapshot.ts         # Accessibility tree → @ref assignment → Locator map + diff/annotate/-C
│   ├── read-commands.ts    # Non-mutating commands (text, html, links, js, css, is, dialog, etc.)
│   ├── write-commands.ts   # Mutating commands (click, fill, select, upload, dialog-accept, etc.)
│   ├── meta-commands.ts    # Server management, chain, diff, snapshot routing
│   ├── cookie-import-browser.ts  # Decrypt + import cookies from real Chromium browsers
│   ├── cookie-picker-routes.ts   # HTTP routes for interactive cookie picker UI
│   ├── cookie-picker-ui.ts       # Self-contained HTML/CSS/JS for cookie picker
│   └── buffers.ts          # CircularBuffer<T> + console/network/dialog capture
├── test/                   # Integration tests + HTML fixtures
└── dist/
    └── browse              # Compiled binary (~58MB, Bun --compile)
```

### Hệ thống snapshot

Đổi mới chính của trình duyệt là việc chọn phần tử dựa trên ref, được xây dựng trên Playwright's accessibility tree API:

1. `page.locator(scope).ariaSnapshot()` trả về một cây accessibility giống YAML
2. Parser snapshot gán các ref (`@e1`, `@e2`, ...) cho mỗi phần tử
3. Với mỗi ref, nó xây dựng một Playwright `Locator` (dùng `getByRole` + nth-child)
4. Bản đồ ref-to-Locator được lưu trên `BrowserManager`
5. Các lệnh sau như `click @e3` tra cứu Locator và gọi `locator.click()`

Không thay đổi DOM. Không inject script. Chỉ dùng Playwright's native accessibility API.

**Phát hiện ref cũ:** SPA có thể thay đổi DOM mà không điều hướng (React router, chuyển tab, modal). Khi điều này xảy ra, các ref thu thập từ `snapshot` trước có thể trỏ đến các phần tử không còn tồn tại. Để xử lý điều này, `resolveRef()` chạy kiểm tra `count()` bất đồng bộ trước khi dùng bất kỳ ref nào — nếu số lượng phần tử là 0, nó ném ngay lập tức với thông báo yêu cầu agent chạy lại `snapshot`. Điều này thất bại nhanh (~5ms) thay vì chờ timeout hành động 30 giây của Playwright.

**Tính năng snapshot mở rộng:**
- `--diff` (`-D`): Lưu mỗi snapshot làm baseline. Ở lần gọi `-D` tiếp theo, trả về unified diff cho thấy những gì đã thay đổi. Dùng để xác minh rằng một hành động (click, fill, v.v.) thực sự đã hoạt động.
- `--annotate` (`-a`): Inject các overlay div tạm thời tại bounding box của mỗi ref, chụp screenshot với nhãn ref hiển thị, rồi xóa các overlay. Dùng `-o <path>` để kiểm soát đường dẫn output.
- `--cursor-interactive` (`-C`): Quét các phần tử tương tác không thuộc ARIA (div với `cursor:pointer`, `onclick`, `tabindex>=0`) dùng `page.evaluate`. Gán ref `@c1`, `@c2`... với CSS selector `nth-child` xác định. Đây là các phần tử mà cây ARIA bỏ sót nhưng người dùng vẫn có thể nhấp.

### Các chế độ screenshot

Lệnh `screenshot` hỗ trợ bốn chế độ:

| Chế độ | Cú pháp | Playwright API |
|------|--------|----------------|
| Toàn trang (mặc định) | `screenshot [path]` | `page.screenshot({ fullPage: true })` |
| Chỉ viewport | `screenshot --viewport [path]` | `page.screenshot({ fullPage: false })` |
| Cắt theo phần tử | `screenshot "#sel" [path]` hoặc `screenshot @e3 [path]` | `locator.screenshot()` |
| Cắt theo vùng | `screenshot --clip x,y,w,h [path]` | `page.screenshot({ clip })` |

Cắt theo phần tử chấp nhận CSS selector (`.class`, `#id`, `[attr]`) hoặc ref `@e`/`@c` từ `snapshot`. Tự phát hiện: tiền tố `@e`/`@c` = ref, tiền tố `.`/`#`/`[` = CSS selector, tiền tố `--` = flag, mọi thứ khác = đường dẫn output.

Loại trừ lẫn nhau: `--clip` + selector và `--viewport` + `--clip` đều ném lỗi. Flag không xác định (ví dụ `--bogus`) cũng ném lỗi.

### Xác thực

Mỗi phiên server tạo một UUID ngẫu nhiên làm bearer token. Token được ghi vào file trạng thái (`.antidev/browse.json`) với chmod 600. Mỗi HTTP request phải bao gồm `Authorization: Bearer <token>`. Điều này ngăn các tiến trình khác trên máy kiểm soát trình duyệt.

### Bắt console, network và dialog

Server hook vào các sự kiện `page.on('console')`, `page.on('response')`, và `page.on('dialog')` của Playwright. Tất cả entry được giữ trong circular buffer O(1) (dung lượng 50.000 mỗi cái) và flush ra đĩa bất đồng bộ qua `Bun.write()`:

- Console: `.antidev/browse-console.log`
- Network: `.antidev/browse-network.log`
- Dialog: `.antidev/browse-dialog.log`

Các lệnh `console`, `network`, và `dialog` đọc từ buffer trong bộ nhớ, không phải đĩa.

### Bàn giao người dùng

Khi trình duyệt headless không thể tiến tiếp (CAPTCHA, MFA, xác thực phức tạp), `handoff` mở một cửa sổ Chrome hiển thị tại đúng trang đó với tất cả cookie, localStorage và tab được bảo toàn. Người dùng giải quyết vấn đề thủ công, sau đó `resume` trả quyền kiểm soát về agent với snapshot mới.

```bash
$B handoff "Stuck on CAPTCHA at login page"   # opens visible Chrome
# User solves CAPTCHA...
$B resume                                       # returns to headless with fresh snapshot
```

Trình duyệt tự động gợi ý `handoff` sau 3 lần thất bại liên tiếp. Trạng thái được bảo toàn hoàn toàn qua quá trình chuyển đổi — không cần đăng nhập lại.

### Xử lý hộp thoại

Hộp thoại (alert, confirm, prompt) được tự động chấp nhận theo mặc định để ngăn trình duyệt bị khóa. Các lệnh `dialog-accept` và `dialog-dismiss` kiểm soát hành vi này. Đối với prompt, `dialog-accept <text>` cung cấp văn bản phản hồi. Tất cả hộp thoại được ghi vào dialog buffer với loại, thông báo và hành động đã thực hiện.

### Thực thi JavaScript (`js` và `eval`)

`js` chạy một biểu thức đơn, `eval` chạy một file JS. Cả hai đều hỗ trợ `await` — các biểu thức chứa `await` được tự động bọc trong một async context:

```bash
$B js "await fetch('/api/data').then(r => r.json())"  # works
$B js "document.title"                                  # also works (no wrapping needed)
$B eval my-script.js                                    # file with await works too
```

Đối với file `eval`, các file một dòng trả về giá trị biểu thức trực tiếp. Các file nhiều dòng cần `return` tường minh khi dùng `await`. Comment chứa "await" không kích hoạt bọc.

### Hỗ trợ đa workspace

Mỗi workspace có instance trình duyệt riêng biệt với tiến trình Chromium, tab, cookie và log riêng. Trạng thái được lưu trong `.antidev/` bên trong thư mục gốc project (phát hiện qua `git rev-parse --show-toplevel`).

| Workspace | File trạng thái | Cổng |
|-----------|------------|------|
| `/code/project-a` | `/code/project-a/.antidev/browse.json` | ngẫu nhiên (10000-60000) |
| `/code/project-b` | `/code/project-b/.antidev/browse.json` | ngẫu nhiên (10000-60000) |

Không xung đột cổng. Không chia sẻ trạng thái. Mỗi project hoàn toàn độc lập.

### Biến môi trường

| Biến | Mặc định | Mô tả |
|----------|---------|-------------|
| `BROWSE_PORT` | 0 (ngẫu nhiên 10000-60000) | Cổng cố định cho HTTP server (ghi đè debug) |
| `BROWSE_IDLE_TIMEOUT` | 1800000 (30 phút) | Timeout tắt khi không hoạt động, tính bằng ms |
| `BROWSE_STATE_FILE` | `.antidev/browse.json` | Đường dẫn đến file trạng thái (CLI truyền cho server) |
| `BROWSE_SERVER_SCRIPT` | tự phát hiện | Đường dẫn đến server.ts |

### Hiệu năng

| Công cụ | Lần gọi đầu | Các lần tiếp theo | Overhead ngữ cảnh mỗi lần gọi |
|------|-----------|-----------------|--------------------------|
| Chrome MCP | ~5s | ~2-5s | ~2000 token (schema + protocol) |
| Playwright MCP | ~3s | ~1-3s | ~1500 token (schema + protocol) |
| **antidev browse** | **~3s** | **~100-200ms** | **0 token** (plain text stdout) |

Sự khác biệt về overhead ngữ cảnh tích lũy nhanh. Trong một phiên trình duyệt 20 lệnh, các công cụ MCP tiêu tốn 30.000-40.000 token chỉ cho framing giao thức. antidev tiêu tốn không.

### Tại sao CLI thay vì MCP?

MCP (Model Context Protocol) hoạt động tốt cho các dịch vụ từ xa, nhưng đối với tự động hóa trình duyệt cục bộ, nó chỉ thêm overhead thuần túy:

- **Phình ngữ cảnh**: mỗi lần gọi MCP bao gồm JSON schema đầy đủ và framing giao thức. Một yêu cầu "lấy văn bản trang" đơn giản tốn nhiều hơn 10x token ngữ cảnh so với mức cần thiết.
- **Kết nối dễ vỡ**: kết nối WebSocket/stdio liên tục bị đứt và không kết nối lại được.
- **Trừu tượng không cần thiết**: Claude Code đã có công cụ Bash. Một CLI in ra stdout là interface đơn giản nhất có thể.

antidev bỏ qua tất cả những điều này. Binary đã biên dịch. Plain text vào, plain text ra. Không có giao thức. Không có schema. Không quản lý kết nối.

## Lời cảm ơn

Lớp tự động hóa trình duyệt được xây dựng trên [Playwright](https://playwright.dev/) của Microsoft. Playwright's accessibility tree API, locator system và headless Chromium management là những thứ làm cho tương tác dựa trên ref trở nên khả thi. Hệ thống snapshot — gán nhãn `@ref` cho các node accessibility tree và ánh xạ chúng trở lại Playwright Locator — được xây dựng hoàn toàn trên các primitives của Playwright. Cảm ơn nhóm Playwright đã xây dựng một nền tảng vững chắc như vậy.

## Phát triển

### Yêu cầu tiên quyết

- [Bun](https://bun.sh/) v1.0+
- Playwright's Chromium (cài đặt tự động bởi `bun install`)

### Bắt đầu nhanh

```bash
bun install              # install dependencies + Playwright Chromium
bun test                 # run integration tests (~3s)
bun run dev <cmd>        # run CLI from source (no compile)
bun run build            # compile to browse/dist/browse
```

### Chế độ dev so với binary đã biên dịch

Trong quá trình phát triển, dùng `bun run dev` thay vì binary đã biên dịch. Nó chạy `browse/src/cli.ts` trực tiếp với Bun, cho phép bạn nhận phản hồi ngay lập tức mà không cần bước biên dịch:

```bash
bun run dev goto https://example.com
bun run dev text
bun run dev snapshot -i
bun run dev click @e3
```

Binary đã biên dịch (`bun run build`) chỉ cần thiết cho phân phối. Nó tạo ra một file thực thi đơn ~58MB tại `browse/dist/browse` dùng flag `--compile` của Bun.

### Chạy kiểm tra

```bash
bun test                         # run all tests
bun test browse/test/commands              # run command integration tests only
bun test browse/test/snapshot              # run snapshot tests only
bun test browse/test/cookie-import-browser # run cookie import unit tests only
```

Các bài kiểm tra khởi động một HTTP server cục bộ (`browse/test/test-server.ts`) phục vụ các file HTML fixture từ `browse/test/fixtures/`, sau đó thực thi các lệnh CLI trên các trang đó. 203 bài kiểm tra trên 3 file, tổng cộng ~15 giây.

### Bản đồ nguồn

| File | Vai trò |
|------|------|
| `browse/src/cli.ts` | Điểm vào. Đọc `.antidev/browse.json`, gửi HTTP đến server, in kết quả. |
| `browse/src/server.ts` | Bun HTTP server. Route lệnh đến handler phù hợp. Quản lý idle timeout. |
| `browse/src/browser-manager.ts` | Vòng đời Chromium — khởi chạy, quản lý tab, bản đồ ref, phát hiện crash. |
| `browse/src/snapshot.ts` | Phân tích accessibility tree, gán ref `@e`/`@c`, xây dựng bản đồ Locator. Xử lý `--diff`, `--annotate`, `-C`. |
| `browse/src/read-commands.ts` | Các lệnh không thay đổi: `text`, `html`, `links`, `js`, `css`, `is`, `dialog`, `forms`, v.v. Export `getCleanText()`. |
| `browse/src/write-commands.ts` | Các lệnh thay đổi: `goto`, `click`, `fill`, `upload`, `dialog-accept`, `useragent` (với tái tạo context), v.v. |
| `browse/src/meta-commands.ts` | Quản lý server, routing chain, diff (DRY qua `getCleanText`), snapshot delegation. |
| `browse/src/cookie-import-browser.ts` | Giải mã cookie Chromium qua macOS Keychain + PBKDF2/AES-128-CBC. Tự phát hiện trình duyệt đã cài. |
| `browse/src/cookie-picker-routes.ts` | HTTP route cho `/cookie-picker/*` — danh sách trình duyệt, tìm kiếm domain, import, xóa. |
| `browse/src/cookie-picker-ui.ts` | HTML generator tự chứa cho cookie picker tương tác (dark theme, không framework). |
| `browse/src/buffers.ts` | `CircularBuffer<T>` (O(1) ring buffer) + bắt console/network/dialog với async disk flush. |

### Triển khai lên skill đang hoạt động

Skill đang hoạt động ở `~/.claude/skills/antidev/`. Sau khi thực hiện thay đổi:

1. Push nhánh của bạn
2. Pull trong thư mục skill: `cd ~/.claude/skills/antidev && git pull`
3. Rebuild: `cd ~/.claude/skills/antidev && bun run build`

Hoặc sao chép binary trực tiếp: `cp browse/dist/browse ~/.claude/skills/antidev/browse/dist/browse`

### Thêm lệnh mới

1. Thêm handler trong `read-commands.ts` (không thay đổi) hoặc `write-commands.ts` (thay đổi)
2. Đăng ký route trong `server.ts`
3. Thêm test case trong `browse/test/commands.test.ts` với file HTML fixture nếu cần
4. Chạy `bun test` để xác minh
5. Chạy `bun run build` để biên dịch

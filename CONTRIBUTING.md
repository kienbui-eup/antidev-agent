# Đóng góp cho gstack

Cảm ơn bạn đã muốn cải thiện gstack. Dù bạn đang sửa lỗi đánh máy trong skill prompt hay xây dựng một quy trình hoàn toàn mới, hướng dẫn này sẽ giúp bạn bắt đầu nhanh chóng.

## Bắt đầu nhanh

gstack skill là các file Markdown mà Claude Code phát hiện từ thư mục `skills/`. Thường chúng nằm tại `~/.claude/skills/gstack/` (cài đặt toàn cục của bạn). Nhưng khi bạn đang phát triển gstack, bạn muốn Claude Code dùng các skill *trong working tree của bạn* — để các chỉnh sửa có hiệu lực ngay lập tức mà không cần copy hay deploy gì cả.

Đó là những gì dev mode làm. Nó symlink repo của bạn vào thư mục `.claude/skills/` cục bộ để Claude Code đọc skill thẳng từ checkout của bạn.

```bash
git clone <repo> && cd gstack
bun install                    # cài đặt dependencies
bin/dev-setup                  # kích hoạt dev mode
```

Bây giờ chỉnh sửa bất kỳ `SKILL.md`, gọi nó trong Claude Code (ví dụ `/review`), và xem thay đổi của bạn trực tiếp. Khi bạn xong việc phát triển:

```bash
bin/dev-teardown               # tắt — quay lại cài đặt toàn cục
```

## Chế độ contributor

Chế độ contributor biến gstack thành công cụ tự cải thiện. Bật nó và Claude Code
sẽ định kỳ phản ánh về trải nghiệm gstack của nó — đánh giá từ 0-10 ở cuối
mỗi bước quy trình lớn. Khi điều gì đó không đạt 10, nó suy nghĩ về lý do và nộp
báo cáo vào `~/.gstack/contributor-logs/` với những gì đã xảy ra, bước tái tạo, và những gì
sẽ cải thiện nó.

```bash
~/.claude/skills/gstack/bin/gstack-config set gstack_contributor true
```

Các log là của **bạn**. Khi điều gì đó khó chịu đủ để sửa, báo cáo đã được viết sẵn.
Fork gstack, symlink fork của bạn vào dự án nơi bạn gặp vấn đề, sửa nó, và mở PR.

### Quy trình contributor

1. **Dùng gstack bình thường** — chế độ contributor phản ánh và ghi log vấn đề tự động
2. **Kiểm tra log của bạn:** `ls ~/.gstack/contributor-logs/`
3. **Fork và clone gstack** (nếu bạn chưa làm)
4. **Symlink fork của bạn vào dự án nơi bạn gặp lỗi:**
   ```bash
   # Trong dự án chính của bạn (cái khiến gstack làm phiền bạn)
   ln -sfn /path/to/your/gstack-fork .claude/skills/gstack
   cd .claude/skills/gstack && bun install && bun run build
   ```
5. **Sửa vấn đề** — các thay đổi của bạn có hiệu lực ngay lập tức trong dự án này
6. **Kiểm tra bằng cách thực sự dùng gstack** — làm điều đã khó chịu bạn, xác minh nó đã được sửa
7. **Mở PR từ fork của bạn**

Đây là cách tốt nhất để đóng góp: sửa gstack trong khi làm công việc thực sự, trong
dự án nơi bạn thực sự cảm thấy nỗi đau.

### Nhận thức phiên

Khi bạn có 3+ phiên gstack mở đồng thời, mỗi câu hỏi cho bạn biết dự án nào, nhánh nào, và điều gì đang xảy ra. Không còn nhìn chằm chằm vào câu hỏi và nghĩ "chờ đã, đây là cửa sổ nào?" Định dạng nhất quán trên tất cả 15 skill.

## Làm việc trên gstack trong repo gstack

Khi bạn đang chỉnh sửa gstack skill và muốn kiểm tra chúng bằng cách thực sự dùng gstack
trong cùng repo, `bin/dev-setup` thiết lập điều này. Nó tạo `.claude/skills/`
symlink (gitignored) trỏ lại working tree của bạn, vì vậy Claude Code dùng
các chỉnh sửa cục bộ của bạn thay vì cài đặt toàn cục.

```
gstack/                          <- working tree của bạn
├── .claude/skills/              <- được tạo bởi dev-setup (gitignored)
│   ├── gstack -> ../../         <- symlink trỏ lại root repo
│   ├── review -> gstack/review
│   ├── ship -> gstack/ship
│   └── ...                      <- một symlink mỗi skill
├── review/
│   └── SKILL.md                 <- chỉnh sửa cái này, test với /review
├── ship/
│   └── SKILL.md
├── browse/
│   ├── src/                     <- nguồn TypeScript
│   └── dist/                    <- binary đã biên dịch (gitignored)
└── ...
```

## Quy trình hàng ngày

```bash
# 1. Vào dev mode
bin/dev-setup

# 2. Chỉnh sửa một skill
vim review/SKILL.md

# 3. Kiểm tra trong Claude Code — các thay đổi có hiệu lực ngay
#    > /review

# 4. Chỉnh sửa nguồn browse? Rebuild binary
bun run build

# 5. Xong ngày hôm nay? Tear down
bin/dev-teardown
```

## Testing & eval

### Cài đặt

```bash
# 1. Copy .env.example và thêm API key của bạn
cp .env.example .env
# Chỉnh .env → đặt ANTHROPIC_API_KEY=sk-ant-...

# 2. Cài đặt dependencies (nếu chưa làm)
bun install
```

Bun tự động tải `.env` — không cần cấu hình thêm. Conductor workspace kế thừa `.env` từ main worktree tự động (xem "Conductor workspace" bên dưới).

### Các cấp độ test

| Cấp độ | Lệnh | Chi phí | Những gì nó test |
|------|---------|------|---------------|
| 1 — Tĩnh | `bun test` | Miễn phí | Xác thực lệnh, snapshot flag, tính đúng đắn SKILL.md, tham chiếu TODOS-format.md, unit test quan sát |
| 2 — E2E | `bun run test:e2e` | ~$3.85 | Thực thi skill đầy đủ qua subprocess `claude -p` |
| 3 — LLM eval | `bun run test:evals` | ~$0.15 độc lập | Chấm điểm LLM-as-judge cho tài liệu SKILL.md được tạo ra |
| 2+3 | `bun run test:evals` | ~$4 kết hợp | E2E + LLM-as-judge (chạy cả hai) |

```bash
bun test                     # Chỉ Cấp độ 1 (chạy mỗi commit, <5s)
bun run test:e2e             # Cấp độ 2: Chỉ E2E (cần EVALS=1, không thể chạy bên trong Claude Code)
bun run test:evals           # Cấp độ 2 + 3 kết hợp (~$4/lần chạy)
```

### Cấp độ 1: Xác thực tĩnh (miễn phí)

Chạy tự động với `bun test`. Không cần API key.

- **Skill parser test** (`test/skill-parser.test.ts`) — Trích xuất mọi lệnh `$B` từ các khối code bash SKILL.md và xác thực so với registry lệnh trong `browse/src/commands.ts`. Phát hiện lỗi đánh máy, lệnh bị xóa, và snapshot flag không hợp lệ.
- **Skill validation test** (`test/skill-validation.test.ts`) — Xác thực rằng các file SKILL.md chỉ tham chiếu các lệnh và flag thực, và mô tả lệnh đáp ứng ngưỡng chất lượng.
- **Generator test** (`test/gen-skill-docs.test.ts`) — Test hệ thống template: xác minh placeholder được giải quyết đúng, output bao gồm gợi ý giá trị cho flag (ví dụ `-d <N>` chứ không phải chỉ `-d`), mô tả phong phú cho các lệnh quan trọng (ví dụ `is` liệt kê trạng thái hợp lệ, `press` liệt kê ví dụ key).

### Cấp độ 2: E2E qua `claude -p` (~$3.85/lần chạy)

Spawn `claude -p` như subprocess với `--output-format stream-json --verbose`, stream NDJSON cho tiến trình thời gian thực, và quét lỗi browse. Đây là điều gần nhất với "skill này có thực sự hoạt động end-to-end không?"

```bash
# Phải chạy từ terminal thông thường — không thể lồng bên trong Claude Code hoặc Conductor
EVALS=1 bun test test/skill-e2e.test.ts
```

- Được giới hạn bởi biến môi trường `EVALS=1` (ngăn chạy tốn tiền không chủ ý)
- Tự động bỏ qua nếu đang chạy bên trong Claude Code (`claude -p` không thể lồng nhau)
- Kiểm tra kết nối API trước — thất bại nhanh trên ConnectionRefused trước khi tốn ngân sách
- Tiến trình thời gian thực đến stderr: `[Ns] turn T tool #C: Name(...)`
- Lưu transcript NDJSON đầy đủ và JSON thất bại để debug
- Test nằm trong `test/skill-e2e.test.ts`, logic runner trong `test/helpers/session-runner.ts`

### Quan sát E2E

Khi test E2E chạy, chúng tạo ra artifact đọc được bởi máy trong `~/.gstack-dev/`:

| Artifact | Đường dẫn | Mục đích |
|----------|------|---------|
| Heartbeat | `e2e-live.json` | Trạng thái test hiện tại (cập nhật mỗi tool call) |
| Kết quả một phần | `evals/_partial-e2e.json` | Test đã hoàn thành (tồn tại sau kill) |
| Log tiến trình | `e2e-runs/{runId}/progress.log` | Log text chỉ thêm |
| Transcript NDJSON | `e2e-runs/{runId}/{test}.ndjson` | Output `claude -p` thô mỗi test |
| JSON thất bại | `e2e-runs/{runId}/{test}-failure.json` | Dữ liệu chẩn đoán khi thất bại |

**Dashboard trực tiếp:** Chạy `bun run eval:watch` trong terminal thứ hai để xem dashboard trực tiếp hiển thị các test đã hoàn thành, test đang chạy, và chi phí. Dùng `--tail` để cũng hiển thị 10 dòng cuối của progress.log.

**Công cụ lịch sử eval:**

```bash
bun run eval:list            # liệt kê tất cả lần chạy eval (turn, thời gian, chi phí mỗi lần)
bun run eval:compare         # so sánh hai lần chạy — hiển thị delta mỗi test + bình luận Takeaway
bun run eval:summary         # thống kê tổng hợp + hiệu suất trung bình mỗi test qua các lần chạy
```

**Bình luận so sánh eval:** `eval:compare` tạo ra các phần Takeaway bằng ngôn ngữ tự nhiên diễn giải những gì đã thay đổi giữa các lần chạy — gắn cờ hồi quy, ghi chú cải tiến, kêu gọi cải thiện hiệu quả (ít turn hơn, nhanh hơn, rẻ hơn), và tạo ra tóm tắt tổng thể. Điều này được điều khiển bởi `generateCommentary()` trong `eval-store.ts`.

Artifact không bao giờ bị xóa — chúng tích lũy trong `~/.gstack-dev/` để debug post-mortem và phân tích xu hướng.

### Cấp độ 3: LLM-as-judge (~$0.15/lần chạy)

Dùng Claude Sonnet để chấm điểm tài liệu SKILL.md được tạo trên ba chiều:

- **Rõ ràng** — AI agent có thể hiểu hướng dẫn mà không có sự mơ hồ không?
- **Đầy đủ** — Tất cả lệnh, flag, và pattern sử dụng có được ghi lại không?
- **Có thể thực thi** — Agent có thể thực hiện tác vụ chỉ dùng thông tin trong tài liệu không?

Mỗi chiều được chấm từ 1-5. Ngưỡng: mỗi chiều phải đạt **≥ 4**. Còn có regression test so sánh tài liệu được tạo với baseline được duy trì thủ công từ `origin/main` — tài liệu được tạo phải đạt điểm bằng hoặc cao hơn.

```bash
# Cần ANTHROPIC_API_KEY trong .env — bao gồm trong bun run test:evals
```

- Dùng `claude-sonnet-4-6` cho tính ổn định chấm điểm
- Test nằm trong `test/skill-llm-eval.test.ts`
- Gọi API Anthropic trực tiếp (không phải `claude -p`), vì vậy hoạt động từ mọi nơi kể cả bên trong Claude Code

### CI

Một GitHub Action (`.github/workflows/skill-docs.yml`) chạy `bun run gen:skill-docs --dry-run` trên mỗi push và PR. Nếu các file SKILL.md được tạo khác với những gì đã commit, CI thất bại. Điều này phát hiện tài liệu cũ trước khi chúng merge.

Test chạy với binary browse trực tiếp — chúng không yêu cầu dev mode.

## Chỉnh sửa file SKILL.md

File SKILL.md được **tạo** từ template `.tmpl`. Đừng chỉnh sửa `.md` trực tiếp — các thay đổi của bạn sẽ bị ghi đè trong lần build tiếp theo.

```bash
# 1. Chỉnh sửa template
vim SKILL.md.tmpl              # hoặc browse/SKILL.md.tmpl

# 2. Tạo lại
bun run gen:skill-docs

# 3. Kiểm tra sức khỏe
bun run skill:check

# Hoặc dùng watch mode — tự động tạo lại khi lưu
bun run dev:skill
```

Để biết các phương pháp tốt nhất về soạn thảo template (ngôn ngữ tự nhiên thay vì bash-ism, phát hiện nhánh động, sử dụng `{{BASE_BRANCH_DETECT}}`), xem phần "Viết SKILL template" trong CLAUDE.md.

Để thêm lệnh browse, thêm nó vào `browse/src/commands.ts`. Để thêm snapshot flag, thêm nó vào `SNAPSHOT_FLAGS` trong `browse/src/snapshot.ts`. Sau đó rebuild.

## Conductor workspace

Nếu bạn đang dùng [Conductor](https://conductor.build) để chạy nhiều phiên Claude Code song song, `conductor.json` kết nối vòng đời workspace tự động:

| Hook | Script | Chức năng |
|------|--------|-------------|
| `setup` | `bin/dev-setup` | Copy `.env` từ main worktree, cài dependencies, symlink skill |
| `archive` | `bin/dev-teardown` | Xóa symlink skill, dọn dẹp thư mục `.claude/` |

Khi Conductor tạo workspace mới, `bin/dev-setup` chạy tự động. Nó phát hiện main worktree (qua `git worktree list`), copy `.env` của bạn để API key được chuyển qua, và thiết lập dev mode — không cần bước thủ công.

**Cài đặt lần đầu:** Đặt `ANTHROPIC_API_KEY` của bạn trong `.env` trong repo chính (xem `.env.example`). Mỗi Conductor workspace kế thừa nó tự động.

## Những điều cần biết

- **File SKILL.md được tạo.** Chỉnh sửa template `.tmpl`, không phải `.md`. Chạy `bun run gen:skill-docs` để tạo lại.
- **TODOS.md là backlog thống nhất.** Được tổ chức theo skill/component với độ ưu tiên P0-P4. `/ship` tự động phát hiện các mục đã hoàn thành. Tất cả skill lập kế hoạch/review/retro đọc nó để có ngữ cảnh.
- **Thay đổi nguồn Browse cần rebuild.** Nếu bạn chạm vào `browse/src/*.ts`, chạy `bun run build`.
- **Dev mode che khuất cài đặt toàn cục của bạn.** Skill cục bộ theo dự án có độ ưu tiên hơn `~/.claude/skills/gstack`. `bin/dev-teardown` khôi phục cái toàn cục.
- **Conductor workspace là độc lập.** Mỗi workspace là git worktree riêng của nó. `bin/dev-setup` chạy tự động qua `conductor.json`.
- **`.env` được lan truyền qua các worktree.** Đặt nó một lần trong repo chính, tất cả Conductor workspace có nó.
- **`.claude/skills/` là gitignored.** Các symlink không bao giờ được commit.

## Testing các thay đổi của bạn trong dự án thực

**Đây là cách được khuyến nghị để phát triển gstack.** Symlink checkout gstack của bạn
vào dự án nơi bạn thực sự dùng nó, để các thay đổi của bạn có hiệu lực trong khi bạn
làm công việc thực:

```bash
# Trong dự án chính của bạn
ln -sfn /path/to/your/gstack-checkout .claude/skills/gstack
cd .claude/skills/gstack && bun install && bun run build
```

Bây giờ mọi lần gọi gstack skill trong dự án này dùng working tree của bạn. Chỉnh sửa một
template, chạy `bun run gen:skill-docs`, và lần gọi `/review` hoặc `/qa` tiếp theo nhận nó
ngay lập tức.

**Để quay lại cài đặt toàn cục ổn định**, chỉ cần xóa symlink:

```bash
rm .claude/skills/gstack
```

Claude Code tự động quay lại `~/.claude/skills/gstack/`.

### Thay thế: trỏ cài đặt toàn cục của bạn vào một nhánh

Nếu bạn không muốn symlink theo từng dự án, bạn có thể chuyển cài đặt toàn cục:

```bash
cd ~/.claude/skills/gstack
git fetch origin
git checkout origin/<branch>
bun install && bun run build
```

Điều này ảnh hưởng đến tất cả dự án. Để hoàn tác: `git checkout main && git pull && bun run build`.

## Ship các thay đổi của bạn

Khi bạn hài lòng với các chỉnh sửa skill của mình:

```bash
/ship
```

Lệnh này chạy test, review diff, phân loại comment Greptile (với leo thang 2 cấp), quản lý TODOS.md, tăng phiên bản, và mở PR. Xem `ship/SKILL.md` để biết quy trình đầy đủ.

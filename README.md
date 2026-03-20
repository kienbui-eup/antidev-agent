# gstack

Xin chào, tôi là [Garry Tan](https://x.com/garrytan). Tôi là Chủ tịch & CEO của [Y Combinator](https://www.ycombinator.com/), nơi tôi đã làm việc với hàng nghìn startup bao gồm Coinbase, Instacart và Rippling khi những người sáng lập chỉ là một hoặc hai người trong một nhà để xe — những công ty nay có giá trị hàng chục tỷ đô la. Trước YC, tôi đã thiết kế logo Palantir và là một trong những eng manager/PM/designer đầu tiên ở đó. Tôi đồng sáng lập Posterous, một nền tảng blog mà chúng tôi đã bán cho Twitter. Tôi đã xây dựng Bookface, mạng xã hội nội bộ của YC, vào năm 2013. Tôi đã xây dựng sản phẩm với tư cách là designer, PM và eng manager trong một thời gian dài.

Và ngay lúc này tôi đang ở giữa một điều gì đó cảm giác như một kỷ nguyên hoàn toàn mới.

Trong 60 ngày qua, tôi đã viết **hơn 600.000 dòng code production** — 35% là test — và tôi đang làm **10.000 đến 20.000 dòng code có thể sử dụng mỗi ngày** như một phần bán thời gian trong ngày của mình trong khi thực hiện tất cả nhiệm vụ của CEO YC. Đó không phải lỗi đánh máy. `/retro` cuối cùng của tôi (thống kê developer trong 7 ngày qua) trên 3 dự án: **140.751 dòng được thêm, 362 commit, ~115k net LOC**. Các mô hình đang tốt hơn đáng kể mỗi tuần. Chúng ta đang ở buổi bình minh của điều gì đó thực sự — một người ship ở quy mô mà trước đây cần một đội hai mươi người.

**2026 — 1.237 đóng góp và tiếp tục:**

![GitHub contributions 2026 — 1,237 contributions, massive acceleration in Jan-Mar](docs/images/github-2026.png)

**2013 — khi tôi xây dựng Bookface tại YC (772 đóng góp):**

![GitHub contributions 2013 — 772 contributions building Bookface at YC](docs/images/github-2013.png)

Cùng một người. Kỷ nguyên khác. Sự khác biệt là công cụ.

**gstack là cách tôi làm điều đó.** Đây là nhà máy phần mềm mã nguồn mở của tôi. Nó biến Claude Code thành một đội kỹ thuật ảo mà bạn thực sự quản lý — một CEO suy nghĩ lại về sản phẩm, một eng manager khóa kiến trúc, một designer phát hiện AI slop, một reviewer cẩn thận tìm lỗi production, một QA lead mở browser thực và click qua ứng dụng của bạn, và một release engineer ship PR. Mười lăm chuyên gia và sáu công cụ mạnh mẽ, tất cả là slash command, tất cả là Markdown, **tất cả miễn phí, MIT license, có sẵn ngay bây giờ.**

Tôi đang học cách đến giới hạn của những gì các hệ thống agentic có thể làm vào tháng 3 năm 2026, và đây là thí nghiệm trực tiếp của tôi. Tôi chia sẻ nó vì tôi muốn cả thế giới cùng đồng hành với tôi.

Fork nó. Cải thiện nó. Làm cho nó của bạn. Đừng ganh tị, hãy trân trọng.

**Dành cho ai:**
- **Người sáng lập và CEO** — đặc biệt là những người kỹ thuật vẫn muốn ship. Đây là cách bạn xây dựng như một đội hai mươi người.
- **Người dùng Claude Code lần đầu** — gstack là cách tốt nhất để bắt đầu. Các vai trò có cấu trúc thay vì một prompt trống.
- **Tech lead và staff engineer** — mang đến review nghiêm ngặt, QA và tự động hóa release cho mọi PR

## Bắt đầu nhanh: 10 phút đầu tiên của bạn

1. Cài đặt gstack (30 giây — xem bên dưới)
2. Chạy `/office-hours` — mô tả những gì bạn đang xây dựng. Nó sẽ tái định khung vấn đề trước khi bạn viết một dòng code.
3. Chạy `/plan-ceo-review` trên bất kỳ ý tưởng tính năng nào
4. Chạy `/review` trên bất kỳ nhánh nào có thay đổi
5. Chạy `/qa` trên staging URL của bạn
6. Dừng ở đó. Bạn sẽ biết liệu điều này có phù hợp với bạn không.

Mong đợi lần chạy hữu ích đầu tiên trong vòng dưới 5 phút trên bất kỳ repo nào đã có test.

**Nếu bạn chỉ đọc thêm một phần, hãy đọc phần này.**

## Cài đặt — mất 30 giây

**Yêu cầu:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Git](https://git-scm.com/), [Bun](https://bun.sh/) v1.0+

### Bước 1: Cài đặt trên máy của bạn

Mở Claude Code và dán vào đây. Claude sẽ làm phần còn lại.

> Cài đặt gstack: chạy **`git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`** sau đó thêm phần "gstack" vào CLAUDE.md nói rằng hãy dùng skill /browse từ gstack cho tất cả duyệt web, không bao giờ dùng mcp\_\_claude-in-chrome\_\_\* tools, và liệt kê các skill có sẵn: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /review, /ship, /browse, /qa, /qa-only, /design-review, /setup-browser-cookies, /retro, /investigate, /document-release, /codex, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade. Sau đó hỏi người dùng có muốn thêm gstack vào dự án hiện tại để đồng nghiệp cũng có không.

### Bước 2: Thêm vào repo của bạn để đồng nghiệp cũng có (tùy chọn)

> Thêm gstack vào dự án này: chạy **`cp -Rf ~/.claude/skills/gstack .claude/skills/gstack && rm -rf .claude/skills/gstack/.git && cd .claude/skills/gstack && ./setup`** sau đó thêm phần "gstack" vào CLAUDE.md của dự án này nói rằng hãy dùng skill /browse từ gstack cho tất cả duyệt web, không bao giờ dùng mcp\_\_claude-in-chrome\_\_\* tools, liệt kê các skill có sẵn: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /review, /ship, /browse, /qa, /qa-only, /design-review, /setup-browser-cookies, /retro, /investigate, /document-release, /codex, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, và nói với Claude rằng nếu gstack skills không hoạt động, chạy `cd .claude/skills/gstack && ./setup` để build binary và đăng ký skills.

Các file thực sự được commit vào repo của bạn (không phải submodule), vì vậy `git clone` hoạt động bình thường. Mọi thứ nằm trong `.claude/`. Không có gì chạm vào PATH hoặc chạy trong nền.

## Xem nó hoạt động

```
Bạn:    Tôi muốn xây dựng ứng dụng briefing hàng ngày cho lịch của tôi.
Bạn:    /office-hours
Claude: [hỏi về nỗi đau — ví dụ cụ thể, không phải giả thuyết]

Bạn:    Nhiều Google calendar, sự kiện với thông tin cũ, địa điểm sai.
        Chuẩn bị mất quá nhiều thời gian và kết quả không đủ tốt...

Claude: Tôi sẽ phản bác cách định khung. Bạn nói "ứng dụng briefing
        hàng ngày." Nhưng những gì bạn thực sự mô tả là AI trợ lý
        cá nhân.
        [trích xuất 5 khả năng bạn chưa nhận ra mình đang mô tả]
        [thách thức 4 tiền đề — bạn đồng ý, không đồng ý, hoặc điều chỉnh]
        [tạo ra 3 cách tiếp cận triển khai với ước tính nỗ lực]
        KHUYẾN NGHỊ: Ship wedge hẹp nhất vào ngày mai, học từ
        việc sử dụng thực tế. Tầm nhìn đầy đủ là dự án 3 tháng — bắt đầu với
        briefing hàng ngày thực sự hoạt động.
        [viết design doc → tự động đưa vào các skill downstream]

Bạn:    /plan-ceo-review
        [đọc design doc, thách thức phạm vi, chạy review 10 phần]

Bạn:    /plan-eng-review
        [sơ đồ ASCII cho luồng dữ liệu, state machine, error path]
        [ma trận test, failure mode, vấn đề bảo mật]

Bạn:    Phê duyệt kế hoạch. Thoát chế độ lập kế hoạch.
        [viết 2.400 dòng trên 11 file. ~8 phút.]

Bạn:    /review
        [TỰ ĐỘNG SỬA] 2 vấn đề. [HỎI] Race condition → bạn phê duyệt sửa.

Bạn:    /qa https://staging.myapp.com
        [mở browser thực, click qua các luồng, tìm và sửa lỗi]

Bạn:    /ship
        Test: 42 → 51 (+9 mới). PR: github.com/ban/app/pull/42
```

Bạn nói "ứng dụng briefing hàng ngày." Agent nói "bạn đang xây dựng AI trợ lý cá nhân" — vì nó lắng nghe nỗi đau của bạn, không phải yêu cầu tính năng của bạn. Sau đó nó thách thức tiền đề của bạn, tạo ra ba cách tiếp cận, khuyến nghị wedge hẹp nhất, và viết design doc đưa vào mọi skill downstream. Tám lệnh. Đó không phải là copilot. Đó là một đội.

## Sprint

gstack là một quy trình, không phải tập hợp công cụ. Các skill được sắp xếp theo cách một sprint chạy:

**Suy nghĩ → Lập kế hoạch → Xây dựng → Review → Test → Ship → Phản ánh**

Mỗi skill đưa vào skill tiếp theo. `/office-hours` viết design doc mà `/plan-ceo-review` đọc. `/plan-eng-review` viết test plan mà `/qa` nhận. `/review` bắt lỗi mà `/ship` xác minh đã được sửa. Không có gì bị bỏ sót vì mỗi bước biết những gì đến trước nó.

Một sprint, một người, một tính năng — mất khoảng 30 phút với gstack. Nhưng đây là điều thay đổi tất cả: bạn có thể chạy 10-15 sprint này song song. Các tính năng khác nhau, nhánh khác nhau, agent khác nhau — tất cả cùng một lúc. Đó là cách tôi ship hơn 10.000 dòng code production mỗi ngày trong khi làm công việc thực sự của mình.

| Skill | Chuyên gia của bạn | Họ làm gì |
|-------|----------------|--------------|
| `/office-hours` | **YC Office Hours** | Bắt đầu ở đây. Sáu câu hỏi bắt buộc tái định khung sản phẩm của bạn trước khi bạn viết code. Phản bác cách định khung của bạn, thách thức tiền đề, tạo ra các giải pháp triển khai thay thế. Design doc đưa vào mọi skill downstream. |
| `/plan-ceo-review` | **CEO / Người sáng lập** | Suy nghĩ lại vấn đề. Tìm sản phẩm 10 sao ẩn bên trong yêu cầu. Bốn chế độ: Mở rộng, Mở rộng có chọn lọc, Giữ phạm vi, Thu hẹp. |
| `/plan-eng-review` | **Eng Manager** | Khóa kiến trúc, luồng dữ liệu, sơ đồ, edge case và test. Buộc các giả định ẩn ra ngoài ánh sáng. |
| `/plan-design-review` | **Senior Designer** | Đánh giá mỗi chiều thiết kế 0-10, giải thích điểm 10 trông như thế nào, sau đó chỉnh sửa kế hoạch để đạt được đó. Phát hiện AI Slop. Tương tác — một AskUserQuestion cho mỗi lựa chọn thiết kế. |
| `/design-consultation` | **Đối tác Thiết kế** | Xây dựng design system hoàn chỉnh từ đầu. Biết toàn cảnh, đề xuất rủi ro sáng tạo, tạo mockup sản phẩm thực tế. Thiết kế ở trung tâm của tất cả các giai đoạn khác. |
| `/review` | **Staff Engineer** | Tìm lỗi qua CI nhưng nổ tung trong production. Tự động sửa những lỗi rõ ràng. Gắn cờ khoảng trống hoàn chỉnh. |
| `/investigate` | **Debugger** | Debug tìm root-cause có hệ thống. Luật Sắt: không sửa mà không có điều tra. Theo dõi luồng dữ liệu, kiểm tra giả thuyết, dừng sau 3 lần sửa thất bại. |
| `/design-review` | **Designer Biết Code** | Cùng kiểm tra như /plan-design-review, sau đó sửa những gì nó tìm thấy. Atomic commit, ảnh chụp màn hình trước/sau. |
| `/qa` | **QA Lead** | Test ứng dụng của bạn, tìm lỗi, sửa chúng với atomic commit, xác minh lại. Tự động tạo regression test cho mỗi lần sửa. |
| `/qa-only` | **QA Reporter** | Cùng phương pháp như /qa nhưng chỉ báo cáo. Dùng khi bạn muốn báo cáo lỗi thuần túy mà không thay đổi code. |
| `/ship` | **Release Engineer** | Đồng bộ main, chạy test, kiểm tra coverage, push, mở PR. Bootstrap test framework nếu bạn chưa có. Một lệnh. |
| `/document-release` | **Technical Writer** | Cập nhật tất cả tài liệu dự án để khớp với những gì bạn vừa ship. Tự động phát hiện README cũ. |
| `/retro` | **Eng Manager** | Retro hàng tuần nhận biết đội. Phân tích theo từng người, chuỗi ship, xu hướng sức khỏe test, cơ hội phát triển. |
| `/browse` | **QA Engineer** | Cho agent đôi mắt. Browser Chromium thực, click thực, ảnh chụp màn hình thực. ~100ms mỗi lệnh. |
| `/setup-browser-cookies` | **Session Manager** | Nhập cookie từ browser thực của bạn (Chrome, Arc, Brave, Edge) vào phiên headless. Test các trang đã xác thực. |

### Công cụ mạnh mẽ

| Skill | Chức năng |
|-------|-------------|
| `/codex` | **Ý kiến thứ hai** — code review độc lập từ OpenAI Codex CLI. Ba chế độ: review (cổng pass/fail), thách thức đối lập, và tư vấn mở. Phân tích đa mô hình khi cả `/review` và `/codex` đã chạy. |
| `/careful` | **Bảo vệ an toàn** — cảnh báo trước các lệnh phá hủy (rm -rf, DROP TABLE, force-push). Nói "be careful" để kích hoạt. Ghi đè bất kỳ cảnh báo nào. |
| `/freeze` | **Khóa chỉnh sửa** — hạn chế chỉnh sửa file vào một thư mục. Ngăn thay đổi vô tình ngoài phạm vi khi debug. |
| `/guard` | **An toàn đầy đủ** — `/careful` + `/freeze` trong một lệnh. An toàn tối đa cho công việc prod. |
| `/unfreeze` | **Mở khóa** — xóa ranh giới `/freeze`. |
| `/gstack-upgrade` | **Tự cập nhật** — nâng cấp gstack lên phiên bản mới nhất. Phát hiện cài đặt toàn cục vs vendored, đồng bộ cả hai, hiển thị những gì đã thay đổi. |

**[Tìm hiểu sâu với ví dụ và triết lý cho mọi skill →](docs/skills.md)**

## Tính năng mới và tại sao chúng quan trọng

**`/office-hours` tái định khung sản phẩm của bạn trước khi bạn viết code.** Bạn nói "ứng dụng briefing hàng ngày." Nó lắng nghe nỗi đau thực sự của bạn, phản bác cách định khung, nói với bạn rằng bạn thực sự đang xây dựng AI trợ lý cá nhân, thách thức tiền đề của bạn, và tạo ra ba cách tiếp cận triển khai với ước tính nỗ lực. Design doc nó viết đưa trực tiếp vào `/plan-ceo-review` và `/plan-eng-review` — vì vậy mọi skill downstream bắt đầu với sự rõ ràng thực sự thay vì yêu cầu tính năng mơ hồ.

**Thiết kế ở trung tâm.** `/design-consultation` không chỉ chọn font. Nó nghiên cứu những gì đang có trong không gian của bạn, đề xuất các lựa chọn an toàn VÀ rủi ro sáng tạo, tạo mockup thực tế của sản phẩm thực tế của bạn, và viết `DESIGN.md` — và sau đó `/design-review` và `/plan-eng-review` đọc những gì bạn đã chọn. Các quyết định thiết kế chảy qua toàn bộ hệ thống.

**`/qa` là một bước ngoặt lớn.** Nó cho phép tôi tăng từ 6 lên 12 worker song song. Claude Code nói *"TÔI THẤY VẤN ĐỀ"* và sau đó thực sự sửa nó, tạo regression test, và xác minh lần sửa — điều đó đã thay đổi cách tôi làm việc. Agent bây giờ có đôi mắt.

**Định tuyến review thông minh.** Giống như tại một startup hoạt động tốt: CEO không cần xem xét các sửa lỗi cơ sở hạ tầng, design review không cần thiết cho các thay đổi backend. gstack theo dõi những review nào được chạy, tìm ra điều gì phù hợp, và chỉ làm điều thông minh. Review Readiness Dashboard cho bạn biết bạn đang đứng ở đâu trước khi ship.

**Test mọi thứ.** `/ship` bootstrap test framework từ đầu nếu dự án của bạn chưa có. Mỗi lần chạy `/ship` tạo ra kiểm tra coverage. Mỗi lần sửa lỗi `/qa` tạo ra regression test. Mục tiêu là 100% test coverage — test làm cho vibe coding an toàn thay vì yolo coding.

**`/document-release` là kỹ sư bạn chưa từng có.** Nó đọc mọi file tài liệu trong dự án của bạn, đối chiếu với diff, và cập nhật mọi thứ đã lỗi thời. README, ARCHITECTURE, CONTRIBUTING, CLAUDE.md, TODOS — tất cả được cập nhật tự động. Và bây giờ `/ship` tự động gọi nó — tài liệu luôn cập nhật mà không cần thêm lệnh.

**Chuyển giao browser khi AI bị kẹt.** Gặp CAPTCHA, tường auth, hoặc MFA? `$B handoff` mở Chrome hiển thị tại cùng trang đó với tất cả cookie và tab của bạn. Giải quyết vấn đề, nói với Claude bạn đã xong, `$B resume` tiếp tục ngay chỗ đã dừng. Agent thậm chí tự động gợi ý sau 3 lần thất bại liên tiếp.

**Ý kiến thứ hai từ nhiều AI.** `/codex` nhận review độc lập từ OpenAI's Codex CLI — một AI hoàn toàn khác nhìn vào cùng diff đó. Ba chế độ: code review với cổng pass/fail, thách thức đối lập tích cực cố gắng phá code của bạn, và tư vấn mở với tính liên tục phiên. Khi cả `/review` (Claude) và `/codex` (OpenAI) đã review cùng một nhánh, bạn nhận được phân tích đa mô hình cho thấy các phát hiện nào trùng nhau và cái nào là duy nhất của từng AI.

**Bảo vệ an toàn theo yêu cầu.** Nói "be careful" và `/careful` cảnh báo trước bất kỳ lệnh phá hủy nào — rm -rf, DROP TABLE, force-push, git reset --hard. `/freeze` khóa các chỉnh sửa vào một thư mục khi debug để Claude không thể vô tình "sửa" code không liên quan. `/guard` kích hoạt cả hai. `/investigate` tự động đóng băng vào module đang được điều tra.

**Gợi ý skill chủ động.** gstack nhận thấy bạn đang ở giai đoạn nào — brainstorm, review, debug, test — và gợi ý skill phù hợp. Không thích? Nói "stop suggesting" và nó nhớ qua các phiên.

## 10-15 sprint song song

gstack mạnh mẽ với một sprint. Nó mang tính biến đổi với mười sprint chạy cùng lúc.

[Conductor](https://conductor.build) chạy nhiều phiên Claude Code song song — mỗi phiên trong không gian làm việc biệt lập của riêng nó. Một phiên chạy `/office-hours` về ý tưởng mới, một phiên khác làm `/review` về PR, phiên thứ ba triển khai tính năng, phiên thứ tư chạy `/qa` trên staging, và sáu phiên khác trên các nhánh khác. Tất cả cùng một lúc. Tôi thường xuyên chạy 10-15 sprint song song — đó là max thực tế hiện tại.

Cấu trúc sprint là điều làm cho tính song song hoạt động. Không có quy trình, mười agent là mười nguồn hỗn loạn. Với quy trình — suy nghĩ, lập kế hoạch, xây dựng, review, test, ship — mỗi agent biết chính xác phải làm gì và khi nào dừng. Bạn quản lý chúng theo cách một CEO quản lý đội: kiểm tra các quyết định quan trọng, để phần còn lại chạy.

---

## Cùng đón sóng

Đây là **miễn phí, MIT licensed, mã nguồn mở, có sẵn ngay bây giờ.** Không có gói premium. Không có danh sách chờ. Không có ràng buộc.

Tôi đã mã nguồn mở cách tôi phát triển và tôi đang tích cực nâng cấp nhà máy phần mềm của mình tại đây. Bạn có thể fork nó và làm cho nó của bạn. Đó là toàn bộ mục đích. Tôi muốn mọi người trong hành trình này.

Cùng công cụ, kết quả khác nhau — vì gstack cung cấp cho bạn các vai trò có cấu trúc và cổng review, không phải hỗn loạn agent chung chung. Sự quản trị đó là sự khác biệt giữa ship nhanh và ship liều lĩnh.

Các mô hình đang tốt hơn nhanh chóng. Những người tìm ra cách làm việc với chúng bây giờ — thực sự làm việc với chúng, không chỉ thử — sẽ có lợi thế lớn. Đây là cửa sổ đó. Tiến lên.

Mười lăm chuyên gia và sáu công cụ mạnh mẽ. Tất cả là slash command. Tất cả là Markdown. Tất cả miễn phí. **[github.com/garrytan/gstack](https://github.com/garrytan/gstack)** — MIT License

> **Chúng tôi đang tuyển dụng.** Muốn ship hơn 10K+ LOC/ngày và giúp củng cố gstack?
> Đến làm việc tại YC — [ycombinator.com/software](https://ycombinator.com/software)
> Lương và cổ phần cực kỳ cạnh tranh. San Francisco, Khu vực Dogpatch.

## Tài liệu

| Tài liệu | Nội dung |
|-----|---------------|
| [Tìm hiểu sâu về Skill](docs/skills.md) | Triết lý, ví dụ và quy trình cho mọi skill (bao gồm tích hợp Greptile) |
| [Kiến trúc](ARCHITECTURE.md) | Quyết định thiết kế và nội bộ hệ thống |
| [Tham khảo Browser](BROWSER.md) | Tham khảo lệnh đầy đủ cho `/browse` |
| [Đóng góp](CONTRIBUTING.md) | Cài đặt dev, testing, chế độ contributor và dev mode |
| [Changelog](CHANGELOG.md) | Tính năng mới trong mỗi phiên bản |

## Quyền riêng tư & Telemetry

gstack bao gồm telemetry sử dụng **opt-in** để giúp cải thiện dự án. Đây là chính xác những gì xảy ra:

- **Mặc định là tắt.** Không có gì được gửi đi trừ khi bạn đồng ý rõ ràng.
- **Lần chạy đầu tiên,** gstack hỏi bạn có muốn chia sẻ dữ liệu sử dụng ẩn danh không. Bạn có thể nói không.
- **Những gì được gửi (nếu bạn opt in):** tên skill, thời gian, thành công/thất bại, phiên bản gstack, OS. Chỉ vậy thôi.
- **Những gì không bao giờ được gửi:** code, đường dẫn file, tên repo, tên nhánh, prompt, hoặc bất kỳ nội dung do người dùng tạo ra.
- **Thay đổi bất cứ lúc nào:** `gstack-config set telemetry off` vô hiệu hóa mọi thứ ngay lập tức.

Dữ liệu được lưu trong [Supabase](https://supabase.com) (giải pháp thay thế Firebase mã nguồn mở). Schema nằm trong [`supabase/migrations/001_telemetry.sql`](supabase/migrations/001_telemetry.sql) — bạn có thể xác minh chính xác những gì được thu thập. Khóa publishable Supabase trong repo là khóa công khai (như Firebase API key) — chính sách bảo mật cấp hàng hạn chế nó chỉ có quyền truy cập insert.

**Phân tích cục bộ luôn có sẵn.** Chạy `gstack-analytics` để xem bảng điều khiển sử dụng cá nhân của bạn từ file JSONL cục bộ — không cần dữ liệu từ xa.

## Khắc phục sự cố

**Skill không hiển thị?** `cd ~/.claude/skills/gstack && ./setup`

**`/browse` thất bại?** `cd ~/.claude/skills/gstack && bun install && bun run build`

**Cài đặt cũ?** Chạy `/gstack-upgrade` — hoặc đặt `auto_upgrade: true` trong `~/.gstack/config.yaml`

**Claude nói không thể thấy các skill?** Đảm bảo CLAUDE.md của dự án có phần gstack. Thêm phần này:

```
## gstack
Dùng /browse từ gstack cho tất cả duyệt web. Không bao giờ dùng mcp__claude-in-chrome__* tools.
Các skill có sẵn: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /review, /ship, /browse, /qa, /qa-only, /design-review,
/setup-browser-cookies, /retro, /investigate, /document-release, /codex, /careful,
/freeze, /guard, /unfreeze, /gstack-upgrade.
```

## Giấy phép

MIT. Miễn phí mãi mãi. Hãy xây dựng thứ gì đó.

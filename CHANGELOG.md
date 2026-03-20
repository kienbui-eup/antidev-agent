# Nhật ký thay đổi

## [0.8.6] - 2026-03-19

### Đã thêm

- **Bạn giờ có thể xem cách bạn sử dụng antidev.** Chạy `antidev-analytics` để xem bảng điều khiển sử dụng cá nhân — những kỹ năng bạn dùng nhiều nhất, thời gian thực hiện, tỷ lệ thành công. Toàn bộ dữ liệu được lưu cục bộ trên máy của bạn.
- **Telemetry cộng đồng theo lựa chọn.** Khi chạy lần đầu, antidev hỏi bạn có muốn chia sẻ dữ liệu sử dụng ẩn danh không (tên kỹ năng, thời lượng, thông tin sự cố — không bao giờ gồm code hay đường dẫn file). Chọn "yes" và bạn là một phần của nhịp đập cộng đồng. Thay đổi bất cứ lúc nào với `antidev-config set telemetry off`.
- **Bảng điều khiển sức khỏe cộng đồng.** Chạy `antidev-community-dashboard` để xem cộng đồng antidev đang xây dựng gì — các kỹ năng phổ biến nhất, cụm lỗi, phân phối phiên bản. Tất cả được hỗ trợ bởi Supabase.
- **Theo dõi lượt cài đặt qua kiểm tra cập nhật.** Khi telemetry được bật, antidev gửi một ping song song đến Supabase trong quá trình kiểm tra cập nhật — cho chúng tôi biết số lượng cài đặt mà không tăng thêm độ trễ. Tôn trọng cài đặt telemetry của bạn (mặc định tắt). GitHub vẫn là nguồn phiên bản chính.
- **Phân cụm lỗi sự cố.** Lỗi được tự động nhóm theo loại và phiên bản trong backend Supabase, để các lỗi ảnh hưởng nhiều nhất được ưu tiên hiển thị.
- **Theo dõi kênh nâng cấp.** Giờ chúng tôi có thể thấy bao nhiêu người nhìn thấy thông báo nâng cấp so với số người thực sự nâng cấp — giúp chúng tôi phát hành tốt hơn.
- **/retro giờ hiển thị việc sử dụng antidev của bạn.** Các buổi retro hàng tuần bao gồm thống kê sử dụng kỹ năng (những kỹ năng bạn đã dùng, tần suất, tỷ lệ thành công) cùng với lịch sử commit của bạn.
- **Đánh dấu chờ xử lý theo phiên.** Nếu một kỹ năng bị lỗi giữa chừng, lần gọi tiếp theo chỉ hoàn thiện đúng phiên đó — không còn điều kiện tranh chấp giữa các phiên antidev đồng thời nữa.

## [0.8.5] - 2026-03-19

### Đã sửa

- **`/retro` giờ đếm đủ ngày theo lịch.** Chạy retro vào đêm muộn không còn bỏ sót các commit từ đầu ngày nữa. Git xử lý ngày thuần như `--since="2026-03-11"` là "11 giờ tối ngày 11 tháng 3" nếu bạn chạy lúc 11 giờ tối — giờ chúng tôi truyền `--since="2026-03-11T00:00:00"` để luôn bắt đầu từ nửa đêm. Các cửa sổ chế độ so sánh cũng được sửa tương tự.
- **Nhật ký review không còn bị lỗi với tên nhánh có `/`.** Tên nhánh như `KienBui-eup/design-system` gây ra lỗi ghi nhật ký review vì Claude Code chạy các khối bash nhiều dòng như các lần gọi shell riêng biệt, mất biến giữa các lệnh. Các helper nguyên tử mới `antidev-review-log` và `antidev-review-read` đóng gói toàn bộ thao tác trong một lệnh duy nhất.
- **Tất cả template kỹ năng giờ là agnostic với nền tảng.** Đã xóa các mẫu đặc thù của Rails (`bin/test-lane`, `RAILS_ENV`, `.includes()`, `rescue StandardError`, v.v.) khỏi `/ship`, `/review`, `/plan-ceo-review`, và `/plan-eng-review`. Danh sách kiểm tra review giờ hiển thị ví dụ cho Rails, Node, Python, và Django song song.
- **`/ship` đọc CLAUDE.md để tìm lệnh kiểm tra** thay vì hardcode `bin/test-lane` và `npm run test`. Nếu không tìm thấy lệnh kiểm tra, nó hỏi người dùng và lưu câu trả lời vào CLAUDE.md.

### Đã thêm

- **Nguyên tắc thiết kế agnostic với nền tảng** được quy định trong CLAUDE.md — các kỹ năng phải đọc cấu hình dự án, không bao giờ hardcode lệnh framework.
- **Mục `## Testing`** trong CLAUDE.md cho việc khám phá lệnh kiểm tra của `/ship`.

## [0.8.4] - 2026-03-19

### Đã thêm

- **`/ship` giờ tự động đồng bộ tài liệu của bạn.** Sau khi tạo PR, `/ship` chạy `/document-release` như Bước 8.5 — README, ARCHITECTURE, CONTRIBUTING, và CLAUDE.md đều được cập nhật mà không cần lệnh thêm. Không còn tài liệu lỗi thời sau khi ship nữa.
- **Sáu kỹ năng mới trong tài liệu.** README, docs/skills.md, và BROWSER.md giờ bao gồm `/codex` (ý kiến thứ hai từ nhiều AI), `/careful` (cảnh báo lệnh gây hại), `/freeze` (khóa chỉnh sửa theo phạm vi thư mục), `/guard` (chế độ an toàn toàn diện), `/unfreeze`, và `/antidev-upgrade`. Bảng kỹ năng sprint giữ nguyên 15 chuyên gia; một mục "Power tools" mới bao gồm phần còn lại.
- **Handoff trình duyệt được ghi chép ở mọi nơi.** Bảng lệnh BROWSER.md, phần deep-dive docs/skills.md, và phần "What's new" của README đều giải thích `$B handoff` và `$B resume` cho các rào cản CAPTCHA/MFA/xác thực.
- **Gợi ý chủ động biết về tất cả các kỹ năng.** SKILL.md.tmpl gốc giờ gợi ý `/codex`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, và `/antidev-upgrade` ở các giai đoạn quy trình làm việc phù hợp.

## [0.8.3] - 2026-03-19

### Đã thêm

- **Đánh giá kế hoạch giờ hướng dẫn bạn đến bước tiếp theo.** Sau khi chạy `/plan-ceo-review`, `/plan-eng-review`, hoặc `/plan-design-review`, bạn nhận được khuyến nghị về những gì cần chạy tiếp theo — eng review luôn được đề xuất là cổng ship bắt buộc, design review được đề xuất khi phát hiện thay đổi UI, và CEO review được nhắc nhẹ cho các thay đổi sản phẩm lớn. Không cần phải tự nhớ quy trình nữa.
- **Các review biết khi nào chúng đã lỗi thời.** Mỗi review giờ ghi lại commit mà nó đã chạy. Bảng điều khiển so sánh điều đó với HEAD hiện tại của bạn và cho bạn biết chính xác bao nhiêu commit đã trôi qua — "eng review may be stale — 13 commits since review" thay vì phải đoán.
- **`skip_eng_review` được tôn trọng ở mọi nơi.** Nếu bạn đã chọn không dùng eng review toàn cục, các khuyến nghị chuỗi sẽ không nhắc nhở bạn về điều đó.
- **Design review lite giờ cũng theo dõi commit.** Kiểm tra design nhẹ chạy bên trong `/review` và `/ship` nhận được cùng tính năng theo dõi độ lỗi thời như các review đầy đủ.

### Đã sửa

- **Browse không còn điều hướng đến các URL nguy hiểm.** `goto`, `diff`, và `newtab` giờ chặn các scheme `file://`, `javascript:`, `data:` và các endpoint metadata đám mây (`169.254.169.254`, `metadata.google.internal`). Localhost và IP riêng tư vẫn được phép cho kiểm tra QA cục bộ. (Đóng #17)
- **Script cài đặt cho bạn biết những gì còn thiếu.** Chạy `./setup` mà không có `bun` được cài đặt giờ hiển thị lỗi rõ ràng với hướng dẫn cài đặt thay vì thông báo bí hiểm "command not found." (Đóng #147)
- **`/debug` được đổi tên thành `/investigate`.** Claude Code có lệnh `/debug` tích hợp đã che khuất kỹ năng antidev. Quy trình gỡ lỗi tìm nguyên nhân gốc rễ có hệ thống giờ nằm ở `/investigate`. (Đóng #190)
- **Bề mặt shell injection đã được loại bỏ.** Tất cả template kỹ năng giờ sử dụng `source <(antidev-slug)` thay vì `eval $(antidev-slug)`. Hành vi tương tự, không có `eval`. (Đóng #133)
- **25 bài kiểm tra bảo mật mới.** Xác thực URL (16 bài kiểm tra) và xác thực path traversal (14 bài kiểm tra) giờ có các bộ unit test chuyên dụng bao gồm chặn scheme, chặn metadata IP, thoát thư mục, và các trường hợp biên collision prefix.

## [0.8.2] - 2026-03-19

### Đã thêm

- **Chuyển giao cho Chrome thật khi trình duyệt headless bị kẹt.** Gặp CAPTCHA, tường xác thực, hay MFA? Chạy `$B handoff "reason"` và Chrome hiển thị mở ra ở đúng trang đó với tất cả cookie và tab còn nguyên vẹn. Giải quyết vấn đề, báo cho Claude biết bạn xong, và `$B resume` tiếp tục ngay từ nơi bạn dừng lại với snapshot mới.
- **Gợi ý tự động handoff sau 3 lần thất bại liên tiếp.** Nếu công cụ browse thất bại 3 lần liên tiếp, nó gợi ý sử dụng `handoff` — để bạn không lãng phí thời gian xem AI thử lại CAPTCHA.
- **15 bài kiểm tra mới cho tính năng handoff.** Unit test cho lưu/khôi phục trạng thái, theo dõi thất bại, các trường hợp biên, cộng với integration test cho toàn bộ luồng headless-to-headed với bảo toàn cookie và tab.

### Đã thay đổi

- `recreateContext()` được tái cấu trúc để sử dụng các helper chung `saveState()`/`restoreState()` — hành vi tương tự, ít code hơn, sẵn sàng cho các tính năng lưu trữ trạng thái trong tương lai.
- `browser.close()` giờ có timeout 5 giây để ngăn bị treo khi đóng trình duyệt headed trên macOS.

## [0.8.1] - 2026-03-19

### Đã sửa

- **`/qa` không còn từ chối sử dụng trình duyệt với các thay đổi backend-only.** Trước đây, nếu nhánh của bạn chỉ thay đổi template prompt, file config, hoặc logic dịch vụ, `/qa` sẽ phân tích diff, kết luận "không có UI để kiểm tra," và đề xuất chạy eval thay thế. Giờ nó luôn mở trình duyệt — quay lại kiểm tra smoke test chế độ Quick (trang chủ + 5 mục tiêu điều hướng hàng đầu) khi không có trang cụ thể nào được xác định từ diff.

## [0.8.0] - 2026-03-19 — Multi-AI Second Opinion

**`/codex` — nhận ý kiến thứ hai độc lập từ một AI hoàn toàn khác.**

Ba chế độ. `/codex review` chạy Codex CLI của OpenAI trên diff của bạn và cho kết quả pass/fail — nếu Codex tìm thấy các vấn đề nghiêm trọng (`[P1]`), nó thất bại. `/codex challenge` tiếp cận đối nghịch: nó cố tìm cách code của bạn sẽ thất bại trong môi trường production, suy nghĩ như kẻ tấn công và kỹ sư chaos. `/codex <anything>` mở cuộc trò chuyện với Codex về codebase của bạn, với tính liên tục phiên để các follow-up nhớ ngữ cảnh.

Khi cả `/review` (Claude) và `/codex review` đã chạy, bạn nhận được phân tích chéo mô hình cho thấy những phát hiện nào trùng lặp và những gì là duy nhất cho mỗi AI — xây dựng trực giác về khi nào nên tin vào hệ thống nào.

**Tích hợp ở mọi nơi.** Sau khi `/review` hoàn thành, nó cung cấp ý kiến thứ hai từ Codex. Trong `/ship`, bạn có thể chạy Codex review như một cổng tùy chọn trước khi push. Trong `/plan-eng-review`, Codex có thể độc lập phê bình kế hoạch của bạn trước khi đánh giá kỹ thuật bắt đầu. Tất cả kết quả Codex hiển thị trong Review Readiness Dashboard.

**Cũng trong bản phát hành này:** Gợi ý kỹ năng chủ động — antidev giờ nhận biết giai đoạn phát triển bạn đang ở và gợi ý kỹ năng phù hợp. Không thích? Nói "stop suggesting" và nó sẽ nhớ qua các phiên.

## [0.7.4] - 2026-03-18

### Đã thay đổi

- **`/qa` và `/design-review` giờ hỏi phải làm gì với các thay đổi chưa commit** thay vì từ chối khởi động. Khi working tree của bạn có thay đổi, bạn nhận được prompt tương tác với ba lựa chọn: commit thay đổi, stash chúng, hoặc hủy bỏ. Không còn thông báo bí hiểm "ERROR: Working tree is dirty" theo sau là một bức tường văn bản.

## [0.7.3] - 2026-03-18

### Đã thêm

- **Rào cản an toàn bạn có thể bật với một lệnh.** Nói "be careful" hoặc "safety mode" và `/careful` sẽ cảnh báo bạn trước bất kỳ lệnh gây hại nào — `rm -rf`, `DROP TABLE`, force-push, `kubectl delete`, và nhiều hơn nữa. Bạn có thể bỏ qua mọi cảnh báo. Các thao tác dọn dẹp artifact build thông thường (`rm -rf node_modules`, `dist`, `.next`) được đưa vào danh sách trắng.
- **Khóa chỉnh sửa vào một thư mục với `/freeze`.** Đang gỡ lỗi điều gì đó và không muốn Claude "sửa" code không liên quan? `/freeze` chặn tất cả chỉnh sửa file bên ngoài thư mục bạn chọn. Chặn cứng, không chỉ là cảnh báo. Chạy `/unfreeze` để xóa hạn chế mà không kết thúc phiên.
- **`/guard` kích hoạt cả hai cùng lúc.** Một lệnh để đạt an toàn tối đa khi chạm vào hệ thống prod hoặc live — cảnh báo lệnh gây hại cộng với hạn chế chỉnh sửa theo phạm vi thư mục.
- **`/debug` giờ tự động đóng băng chỉnh sửa vào module đang gỡ lỗi.** Sau khi hình thành giả thuyết nguyên nhân gốc rễ, `/debug` khóa chỉnh sửa vào thư mục bị ảnh hưởng hẹp nhất. Không còn các "sửa chữa" tình cờ vào code không liên quan trong khi gỡ lỗi.
- **Bạn giờ có thể xem những kỹ năng bạn sử dụng và tần suất.** Mỗi lần gọi kỹ năng được ghi cục bộ vào `~/.antidev/analytics/skill-usage.jsonl`. Chạy `bun run analytics` để xem các kỹ năng hàng đầu của bạn, phân tích theo repo, và tần suất hook an toàn thực sự bắt được gì đó. Dữ liệu ở lại trên máy của bạn.
- **Các retro hàng tuần giờ bao gồm thống kê sử dụng kỹ năng.** `/retro` hiển thị những kỹ năng bạn đã sử dụng trong cửa sổ retro cùng với phân tích commit và số liệu thông thường của bạn.

## [0.7.2] - 2026-03-18

### Đã sửa

- Phạm vi ngày của `/retro` giờ được căn chỉnh đến nửa đêm thay vì thời gian hiện tại. Chạy `/retro` lúc 9 giờ tối không còn bỏ qua buổi sáng của ngày bắt đầu — bạn nhận được đủ ngày theo lịch.
- Timestamp của `/retro` giờ sử dụng múi giờ địa phương của bạn thay vì giờ Pacific được hardcode. Người dùng ngoài bờ biển phía Tây Hoa Kỳ nhận được giờ địa phương đúng trong histogram, phát hiện phiên, và theo dõi streak.

## [0.7.1] - 2026-03-19

### Đã thêm

- **antidev giờ gợi ý kỹ năng vào những thời điểm tự nhiên.** Bạn không cần biết slash command — chỉ cần nói về những gì bạn đang làm. Đang brainstorm ý tưởng? antidev gợi ý `/office-hours`. Có gì đó bị hỏng? Nó gợi ý `/debug`. Sẵn sàng deploy? Nó gợi ý `/ship`. Mọi kỹ năng workflow giờ có trigger chủ động kích hoạt khi thời điểm phù hợp.
- **Bản đồ vòng đời.** Mô tả kỹ năng gốc của antidev giờ bao gồm hướng dẫn quy trình làm việc của nhà phát triển ánh xạ 12 giai đoạn (brainstorm → plan → review → code → debug → test → ship → docs → retro) đến kỹ năng phù hợp. Claude thấy điều này trong mọi phiên.
- **Chọn không tham gia bằng ngôn ngữ tự nhiên.** Nếu gợi ý chủ động cảm thấy quá mạnh, chỉ cần nói "stop suggesting things" — antidev nhớ qua các phiên. Nói "be proactive again" để bật lại.
- **11 bài kiểm tra E2E theo giai đoạn hành trình.** Mỗi bài kiểm tra mô phỏng một thời điểm thực tế trong vòng đời nhà phát triển với ngữ cảnh dự án thực tế (plan.md, nhật ký lỗi, lịch sử git, code) và xác minh rằng kỹ năng đúng được kích hoạt chỉ từ ngôn ngữ tự nhiên. 11/11 đạt.
- **Xác thực cụm từ kích hoạt.** Các bài kiểm tra tĩnh xác minh mỗi kỹ năng workflow có cụm từ "Use when" và "Proactively suggest" — bắt lỗi hồi quy miễn phí.

### Đã sửa

- `/debug` và `/office-hours` hoàn toàn vô hình với ngôn ngữ tự nhiên — không có cụm từ kích hoạt nào cả. Giờ cả hai đều có trigger phản ứng + chủ động đầy đủ.

## [0.7.0] - 2026-03-18 — YC Office Hours

**`/office-hours` — ngồi xuống với một đối tác YC trước khi bạn viết một dòng code.**

Hai chế độ. Nếu bạn đang xây dựng startup, bạn nhận được sáu câu hỏi bắt buộc được chắt lọc từ cách YC đánh giá sản phẩm: thực tế nhu cầu, nguyên trạng, độ cụ thể tuyệt vọng, nêm hẹp nhất, quan sát & bất ngờ, và phù hợp tương lai. Nếu bạn đang hack trên một dự án phụ, học code, hoặc tại hackathon, bạn nhận được một đối tác brainstorm nhiệt tình giúp bạn tìm ra phiên bản thú vị nhất của ý tưởng.

Cả hai chế độ đều viết một design doc đưa trực tiếp vào `/plan-ceo-review` và `/plan-eng-review`. Sau phiên, kỹ năng phản chiếu lại những gì nó nhận thấy về cách bạn suy nghĩ — các quan sát cụ thể, không phải lời khen chung chung.

**`/debug` — tìm nguyên nhân gốc rễ, không phải triệu chứng.**

Khi có gì đó bị hỏng và bạn không biết tại sao, `/debug` là công cụ gỡ lỗi có hệ thống của bạn. Nó tuân theo Luật Sắt: không có sửa chữa nào mà không có điều tra nguyên nhân gốc rễ trước. Theo dõi luồng dữ liệu, so sánh với các mẫu lỗi đã biết (race condition, nil propagation, stale cache, config drift), và kiểm tra từng giả thuyết một. Nếu 3 lần sửa thất bại, nó dừng lại và đặt câu hỏi về kiến trúc thay vì vùng vẫy.

## [0.6.4.1] - 2026-03-18

### Đã thêm

- **Các kỹ năng giờ có thể khám phá qua ngôn ngữ tự nhiên.** Tất cả 12 kỹ năng bị thiếu cụm từ kích hoạt rõ ràng giờ đã có — nói "deploy this" và Claude tìm `/ship`, nói "check my diff" và nó tìm `/review`. Tuân theo thực hành tốt nhất của Anthropic: "trường mô tả không phải là tóm tắt — đó là khi nào để kích hoạt."

## [0.6.4.0] - 2026-03-17

### Đã thêm

- **`/plan-design-review` giờ là tương tác — đánh giá 0-10, sửa kế hoạch.** Thay vì tạo báo cáo với điểm chữ, nhà thiết kế giờ hoạt động như CEO và Eng review: đánh giá từng chiều thiết kế 0-10, giải thích điểm 10 trông như thế nào, rồi chỉnh sửa kế hoạch để đạt được. Một AskUserQuestion cho mỗi lựa chọn thiết kế. Đầu ra là một kế hoạch tốt hơn, không phải tài liệu về kế hoạch.
- **CEO review giờ mời nhà thiết kế vào.** Khi `/plan-ceo-review` phát hiện phạm vi UI trong kế hoạch, nó kích hoạt mục Thiết kế & UX (Mục 11) bao gồm kiến trúc thông tin, phạm vi trạng thái tương tác, rủi ro AI slop, và ý định responsive. Cho công việc thiết kế sâu, nó khuyến nghị `/plan-design-review`.
- **14 trong số 15 kỹ năng giờ có coverage kiểm tra đầy đủ (E2E + LLM-judge + validation).** Đã thêm đánh giá chất lượng LLM-judge cho 10 kỹ năng còn thiếu: ship, retro, qa-only, plan-ceo-review, plan-eng-review, plan-design-review, design-review, design-consultation, document-release, antidev-upgrade. Đã thêm bài kiểm tra E2E thực cho antidev-upgrade (trước đây là `.todo`). Đã thêm design-consultation vào xác thực lệnh.
- **Phong cách commit bisect.** CLAUDE.md giờ yêu cầu mỗi commit phải là một thay đổi logic đơn — đổi tên tách biệt với viết lại, cơ sở hạ tầng kiểm tra tách biệt với triển khai kiểm tra.

### Đã thay đổi

- `/qa-design-review` được đổi tên thành `/design-review` — tiền tố "qa-" gây nhầm lẫn khi `/plan-design-review` là chế độ kế hoạch. Đã cập nhật trên tất cả 22 file.

## [0.6.3.0] - 2026-03-17

### Đã thêm

- **Mọi PR chạm vào code frontend giờ tự động nhận được design review.** `/review` và `/ship` áp dụng danh sách kiểm tra thiết kế 20 mục lên các file CSS, HTML, JSX, và view đã thay đổi. Bắt các mẫu AI slop (gradient tím, lưới icon 3 cột, copy hero chung chung), vấn đề typography (văn bản thân < 16px, phông chữ bị chặn), lỗ hổng accessibility (`outline: none`), và lạm dụng `!important`. Các sửa CSS cơ học được tự động áp dụng; các quyết định thiết kế phán đoán sẽ hỏi bạn trước.
- **`antidev-diff-scope` phân loại những gì đã thay đổi trong nhánh của bạn.** Chạy `source <(antidev-diff-scope main)` và nhận `SCOPE_FRONTEND=true/false`, `SCOPE_BACKEND`, `SCOPE_PROMPTS`, `SCOPE_TESTS`, `SCOPE_DOCS`, `SCOPE_CONFIG`. Design review sử dụng nó để bỏ qua im lặng trên các PR backend-only. Ship pre-flight sử dụng nó để khuyến nghị design review khi các file frontend được chạm vào.
- **Design review hiển thị trong Review Readiness Dashboard.** Bảng điều khiển giờ phân biệt giữa "LITE" (cấp độ code, chạy tự động trong /review và /ship) và "FULL" (kiểm tra trực quan qua /plan-design-review với browse binary). Cả hai đều hiển thị dưới dạng mục Design Review.
- **Eval E2E cho phát hiện design review.** Các fixture CSS/HTML được trồng với 7 anti-pattern đã biết (phông chữ Papyrus, văn bản thân 14px, `outline: none`, `!important`, gradient tím, copy hero chung chung, lưới tính năng 3 cột). Eval xác minh `/review` bắt ít nhất 4 trong 7.

## [0.6.2.0] - 2026-03-17

### Đã thêm

- **Đánh giá kế hoạch giờ suy nghĩ như những người giỏi nhất thế giới.** `/plan-ceo-review` áp dụng 14 mẫu tư duy từ Bezos (cửa một chiều, hoài nghi proxy Day 1), Grove (quét paranoid), Munger (đảo ngược), Horowitz (ý thức thời chiến), Chesky/Graham (chế độ nhà sáng lập), và Altman (ám ảnh đòn bẩy). `/plan-eng-review` áp dụng 15 mẫu từ Larson (chẩn đoán trạng thái nhóm), McKinley (nhàm chán theo mặc định), Brooks (độ phức tạp thiết yếu vs ngẫu nhiên), Beck (làm cho thay đổi dễ dàng), Majors (sở hữu code của bạn trong production), và Google SRE (ngân sách lỗi). `/plan-design-review` áp dụng 12 mẫu từ Rams (mặc định trừ đi), Norman (thiết kế theo khung thời gian), Zhuo (gu nguyên tắc), Gebbia (thiết kế cho sự tin tưởng, kịch bản hành trình), và Ive (sự quan tâm là hữu hình).
- **Kích hoạt không gian tiềm ẩn, không phải danh sách kiểm tra.** Các mẫu tư duy đề cập tên framework và con người để LLM dựa vào kiến thức sâu của nó về cách họ thực sự suy nghĩ. Hướng dẫn là "nội tâm hóa những điều này, đừng liệt kê chúng" — làm cho mỗi review là một sự thay đổi góc nhìn thực sự, không phải danh sách kiểm tra dài hơn.

## [0.6.1.0] - 2026-03-17

### Đã thêm

- **Các bài kiểm tra E2E và LLM-judge giờ chỉ chạy những gì bạn đã thay đổi.** Mỗi bài kiểm tra khai báo các file nguồn mà nó phụ thuộc vào. Khi bạn chạy `bun run test:e2e`, nó kiểm tra diff của bạn và bỏ qua các bài kiểm tra có dependencies không bị chạm. Một nhánh chỉ thay đổi `/retro` giờ chạy 2 bài kiểm tra thay vì 31. Sử dụng `bun run test:e2e:all` để buộc tất cả.
- **`bun run eval:select` xem trước những bài kiểm tra nào sẽ chạy.** Xem chính xác những bài kiểm tra nào diff của bạn kích hoạt trước khi tiêu API credit. Hỗ trợ `--json` cho scripting và `--base <branch>` để ghi đè nhánh cơ sở.
- **Rào cản đầy đủ bắt các mục kiểm tra bị quên.** Một unit test miễn phí xác thực rằng mỗi `testName` trong các file kiểm tra E2E và LLM-judge có mục tương ứng trong bản đồ TOUCHFILES. Các bài kiểm tra mới không có mục sẽ làm `bun test` thất bại ngay lập tức — không có suy giảm luôn chạy im lặng.

### Đã thay đổi

- `test:evals` và `test:e2e` giờ tự động chọn dựa trên diff (trước: tất cả hoặc không có gì)
- Script `test:evals:all` và `test:e2e:all` mới cho các lần chạy đầy đủ rõ ràng

## 0.6.1 — 2026-03-17 — Boil the Lake

Mọi kỹ năng antidev giờ tuân theo **Nguyên tắc Đầy đủ**: luôn khuyến nghị triển khai
đầy đủ khi AI làm cho chi phí biên gần bằng không. Không còn "Chọn B vì nó có 90% giá
trị" khi tùy chọn A chỉ nhiều hơn 70 dòng code.

Đọc triết lý: https://wiki.eup.ai/antidev/completeness-principle

- **Tính điểm đầy đủ**: mỗi tùy chọn AskUserQuestion giờ hiển thị điểm đầy đủ
  (1-10), nghiêng về giải pháp hoàn chỉnh
- **Ước tính thời gian kép**: ước tính nỗ lực hiển thị cả thời gian nhóm người dùng và thời gian CC+antidev
  (ví dụ: "human: ~2 weeks / CC: ~1 hour") với bảng tham chiếu nén theo loại nhiệm vụ
- **Ví dụ anti-pattern**: thư viện "đừng làm thế này" cụ thể trong phần mở đầu để
  nguyên tắc không trừu tượng
- **Onboarding lần đầu**: người dùng mới thấy phần giới thiệu một lần có liên kết đến
  bài luận, với tùy chọn mở trong trình duyệt
- **Xem xét khoảng trống đầy đủ**: `/review` giờ gắn cờ các triển khai tắt đường nơi
  phiên bản đầy đủ tốn <30 phút thời gian CC
- **Lake Score**: tóm tắt hoàn thành CEO và Eng review hiển thị bao nhiêu khuyến nghị
  đã chọn tùy chọn hoàn chỉnh so với các lối tắt
- **CEO + Eng review thời gian kép**: thẩm vấn thời gian, ước tính nỗ lực, và cơ hội
  thú vị đều hiển thị cả thang thời gian con người và CC

## 0.6.0.1 — 2026-03-17

- **`/antidev-upgrade` giờ tự động bắt các bản sao vendored lỗi thời.** Nếu antidev toàn cục của bạn đã cập nhật nhưng bản sao vendored trong dự án của bạn bị lỗi thời, `/antidev-upgrade` phát hiện sự không khớp và đồng bộ nó. Không còn phải thủ công hỏi "chúng ta đã vendor nó chưa?" — nó chỉ cho bạn biết và đề xuất cập nhật.
- **Đồng bộ nâng cấp an toàn hơn.** Nếu `./setup` thất bại trong khi đồng bộ bản sao vendored, antidev khôi phục phiên bản trước đó từ bản sao lưu thay vì để lại cài đặt bị hỏng.

### Cho người đóng góp

- Mục sử dụng độc lập trong `antidev-upgrade/SKILL.md.tmpl` giờ tham chiếu Bước 2 và 4.5 (DRY) thay vì sao chép các khối bash phát hiện/đồng bộ. Đã thêm một khối bash so sánh phiên bản mới.
- Fallback kiểm tra cập nhật trong chế độ độc lập giờ khớp với mẫu preamble (đường dẫn toàn cục → đường dẫn cục bộ → `|| true`).

## 0.6.0 — 2026-03-17

- **100% test coverage là chìa khóa cho vibe coding tuyệt vời.** antidev giờ tự bootstrap framework kiểm tra từ đầu khi dự án của bạn chưa có. Phát hiện runtime của bạn, nghiên cứu framework tốt nhất, hỏi bạn để chọn, cài đặt nó, viết 3-5 bài kiểm tra thực cho code thực tế của bạn, thiết lập CI/CD (GitHub Actions), tạo TESTING.md, và thêm hướng dẫn văn hóa kiểm tra vào CLAUDE.md. Mỗi phiên Claude Code sau đó sẽ tự nhiên viết kiểm tra.
- **Mỗi lần sửa lỗi giờ nhận được bài kiểm tra hồi quy.** Khi `/qa` sửa lỗi và xác minh nó, Phase 8e.5 tự động tạo bài kiểm tra hồi quy bắt đúng kịch bản đã bị hỏng. Các bài kiểm tra bao gồm truy xuất nguồn gốc đầy đủ trở lại báo cáo QA. Tên file tự động tăng ngăn va chạm qua các phiên.
- **Ship với sự tự tin — kiểm tra coverage hiển thị những gì được kiểm tra và những gì không.** `/ship` Bước 3.4 xây dựng bản đồ đường dẫn code từ diff của bạn, tìm kiếm các bài kiểm tra tương ứng, và tạo sơ đồ coverage ASCII với sao chất lượng (★★★ = trường hợp biên + lỗi, ★★ = đường dẫn happy, ★ = smoke test). Các khoảng trống nhận được bài kiểm tra tự động tạo. Nội dung PR hiển thị "Tests: 42 → 47 (+5 new)".
- **Retro của bạn theo dõi sức khỏe kiểm tra.** `/retro` giờ hiển thị tổng số file kiểm tra, các bài kiểm tra được thêm trong kỳ này, commit kiểm tra hồi quy, và delta xu hướng. Nếu tỷ lệ kiểm tra giảm xuống dưới 20%, nó gắn cờ là khu vực cần cải thiện.
- **Design review cũng tạo bài kiểm tra hồi quy.** `/qa-design-review` Phase 8e.5 bỏ qua các sửa chữa CSS-only (những điều đó được bắt bằng cách chạy lại kiểm tra thiết kế) nhưng viết kiểm tra cho các thay đổi hành vi JavaScript như dropdown bị hỏng hoặc lỗi animation.

### Cho người đóng góp

- Đã thêm resolver `generateTestBootstrap()` vào `gen-skill-docs.ts` (~155 dòng). Đăng ký là `{{TEST_BOOTSTRAP}}` trong bản đồ RESOLVERS. Được chèn vào template qa, ship (Bước 2.5), và qa-design-review.
- Tạo bài kiểm tra hồi quy Phase 8e.5 được thêm vào `qa/SKILL.md.tmpl` (46 dòng) và biến thể có nhận thức CSS vào `qa-design-review/SKILL.md.tmpl` (12 dòng). Quy tắc 13 được sửa đổi để cho phép tạo file kiểm tra mới.
- Kiểm tra coverage kiểm tra Bước 3.4 được thêm vào `ship/SKILL.md.tmpl` (88 dòng) với rubric chấm điểm chất lượng và định dạng sơ đồ ASCII.
- Theo dõi sức khỏe kiểm tra được thêm vào `retro/SKILL.md.tmpl`: 3 lệnh thu thập dữ liệu mới, hàng số liệu, mục tường thuật, trường schema JSON.
- `qa-only/SKILL.md.tmpl` nhận được ghi chú khuyến nghị khi không phát hiện framework kiểm tra.
- `qa-report-template.md` có thêm mục Regression Tests với các spec kiểm tra bị hoãn.
- Bảng placeholder ARCHITECTURE.md được cập nhật với `{{TEST_BOOTSTRAP}}` và `{{REVIEW_DASHBOARD}}`.
- WebSearch được thêm vào các công cụ được phép cho qa, ship, qa-design-review.
- 26 bài kiểm tra xác thực mới, 2 eval E2E mới (bootstrap + kiểm tra coverage).
- 2 TODO P3 mới: CI/CD cho các nhà cung cấp không phải GitHub, tự động nâng cấp các bài kiểm tra yếu.

## 0.5.4 — 2026-03-17

- **Đánh giá kỹ thuật luôn là review đầy đủ giờ.** `/plan-eng-review` không còn yêu cầu bạn chọn giữa chế độ "thay đổi lớn" và "thay đổi nhỏ". Mỗi kế hoạch nhận được walkthrough tương tác đầy đủ (kiến trúc, chất lượng code, kiểm tra, hiệu suất). Giảm phạm vi chỉ được gợi ý khi kiểm tra độ phức tạp thực sự kích hoạt — không phải là tùy chọn menu thường trực.
- **Ship ngừng hỏi về review sau khi bạn đã trả lời.** Khi `/ship` hỏi về các review còn thiếu và bạn nói "ship anyway" hoặc "not relevant," quyết định đó được lưu cho nhánh. Không còn bị hỏi lại mỗi lần bạn chạy lại `/ship` sau một bản sửa lỗi trước khi landing.

### Cho người đóng góp

- Đã xóa menu SMALL_CHANGE / BIG_CHANGE / SCOPE_REDUCTION khỏi `plan-eng-review/SKILL.md.tmpl`. Giảm phạm vi giờ là chủ động (được kích hoạt bởi kiểm tra độ phức tạp) thay vì là mục menu.
- Đã thêm lưu trữ ghi đè cổng review vào `ship/SKILL.md.tmpl` — ghi các mục `ship-review-override` vào `$BRANCH-reviews.jsonl` để các lần chạy `/ship` tiếp theo bỏ qua cổng.
- Đã cập nhật 2 prompt kiểm tra E2E để khớp với luồng mới.

## 0.5.3 — 2026-03-17

- **Bạn luôn kiểm soát — ngay cả khi nghĩ lớn.** `/plan-ceo-review` giờ trình bày mỗi mở rộng phạm vi như một quyết định riêng lẻ mà bạn chọn tham gia. Chế độ EXPANSION khuyến nghị nhiệt tình, nhưng bạn nói có hoặc không với mỗi ý tưởng. Không còn "agent đã đi hoang và thêm 5 tính năng tôi không yêu cầu."
- **Chế độ mới: SELECTIVE EXPANSION.** Giữ phạm vi hiện tại của bạn làm đường cơ sở, nhưng xem những gì khác có thể. Agent đưa ra các cơ hội mở rộng từng cái một với khuyến nghị trung lập — bạn cherry-pick những cái đáng làm. Hoàn hảo để lặp lại trên các tính năng hiện có nơi bạn muốn sự nghiêm ngặt nhưng cũng muốn bị cám dỗ bởi các cải tiến liền kề.
- **Tầm nhìn CEO review của bạn được lưu lại, không bị mất.** Ý tưởng mở rộng, quyết định cherry-pick, và tầm nhìn 10x giờ được lưu vào `~/.antidev/projects/{repo}/ceo-plans/` như các tài liệu thiết kế có cấu trúc. Các kế hoạch lỗi thời được tự động lưu trữ. Nếu một tầm nhìn xuất sắc, bạn có thể promote nó lên `docs/designs/` trong repo của bạn cho nhóm.

- **Cổng ship thông minh hơn.** `/ship` không còn nhắc nhở bạn về CEO và Design review khi chúng không liên quan. Eng Review là cổng bắt buộc duy nhất (và bạn có thể vô hiệu hóa ngay cả điều đó với `antidev-config set skip_eng_review true`). CEO Review được khuyến nghị cho các thay đổi sản phẩm lớn; Design Review cho công việc UI. Bảng điều khiển vẫn hiển thị cả ba — nó chỉ không chặn bạn đối với những cái tùy chọn.

### Cho người đóng góp

- Đã thêm chế độ SELECTIVE EXPANSION vào `plan-ceo-review/SKILL.md.tmpl` với lễ cherry-pick, tư thế khuyến nghị trung lập, và đường cơ sở HOLD SCOPE.
- Đã viết lại Bước 0D của chế độ EXPANSION để bao gồm lễ opt-in — chắt lọc tầm nhìn thành các đề xuất rời rạc, trình bày mỗi cái như AskUserQuestion.
- Đã thêm lưu trữ kế hoạch CEO (bước 0D-POST): markdown có cấu trúc với YAML frontmatter (`status: ACTIVE/ARCHIVED/PROMOTED`), bảng quyết định phạm vi, luồng lưu trữ.
- Đã thêm bước promotion `docs/designs` sau Nhật ký Review.
- Bảng Tham chiếu Nhanh Chế độ mở rộng thành 4 cột.
- Review Readiness Dashboard: Eng Review bắt buộc (có thể ghi đè qua config `skip_eng_review`), CEO/Design tùy chọn theo phán đoán của agent.
- Các bài kiểm tra mới: xác thực chế độ CEO review (4 chế độ, lưu trữ, promotion), bài kiểm tra E2E SELECTIVE EXPANSION.

## 0.5.2 — 2026-03-17

- **Cố vấn thiết kế của bạn giờ chấp nhận rủi ro sáng tạo.** `/design-consultation` không chỉ đề xuất một hệ thống an toàn, nhất quán — nó rõ ràng phân tích SAFE CHOICES (đường cơ sở danh mục) vs. RISKS (nơi sản phẩm của bạn nổi bật). Bạn chọn quy tắc nào để phá vỡ. Mỗi rủi ro đi kèm lý do tại sao nó hoạt động và chi phí là gì.
- **Xem cảnh quan trước khi bạn chọn.** Khi bạn chọn tham gia nghiên cứu, agent duyệt các trang web thực trong không gian của bạn với ảnh chụp màn hình và phân tích cây accessibility — không chỉ là kết quả tìm kiếm web. Bạn thấy những gì đang có ngoài kia trước khi đưa ra quyết định thiết kế.
- **Xem trước các trang trông giống sản phẩm của bạn.** Trang xem trước giờ hiển thị các mockup sản phẩm thực tế — dashboard với sidebar nav và bảng dữ liệu, trang marketing với phần hero, trang cài đặt với biểu mẫu — không chỉ là mẫu phông chữ và bảng màu.

## 0.5.1 — 2026-03-17
- **Biết vị trí của bạn trước khi ship.** Mỗi `/plan-ceo-review`, `/plan-eng-review`, và `/plan-design-review` giờ ghi kết quả của nó vào trình theo dõi review. Ở cuối mỗi review, bạn thấy **Review Readiness Dashboard** hiển thị những review nào đã xong, khi nào chúng chạy, và liệu chúng có sạch không — với kết luận rõ ràng CLEARED TO SHIP hoặc NOT READY.
- **`/ship` kiểm tra các review của bạn trước khi tạo PR.** Pre-flight giờ đọc bảng điều khiển và hỏi xem bạn có muốn tiếp tục không khi thiếu review. Chỉ mang tính thông tin — nó sẽ không chặn bạn, nhưng bạn sẽ biết những gì bạn đã bỏ qua.
- **Một việc ít cần copy-paste hơn.** Tính toán SLUG (pipeline sed mờ đó để tính `owner-repo` từ git remote) giờ là helper chung `bin/antidev-slug`. Tất cả 14 bản sao inline trên các template được thay thế bằng `source <(antidev-slug)`. Nếu định dạng thay đổi, sửa một lần.
- **Ảnh chụp màn hình giờ hiển thị trong các phiên QA và browse.** Khi antidev chụp ảnh màn hình, chúng giờ hiển thị dưới dạng phần tử hình ảnh có thể nhấp vào trong đầu ra của bạn — không còn đường dẫn `/tmp/browse-screenshot.png` vô hình bạn không thể thấy. Hoạt động trong `/qa`, `/qa-only`, `/plan-design-review`, `/qa-design-review`, `/browse`, và `/antidev`.

### Cho người đóng góp

- Đã thêm resolver `{{REVIEW_DASHBOARD}}` vào `gen-skill-docs.ts` — đọc bảng điều khiển chia sẻ được chèn vào 4 template (3 kỹ năng review + ship).
- Đã thêm helper `bin/antidev-slug` (bash 5 dòng) với unit test. Xuất các dòng `SLUG=` và `BRANCH=`, làm sạch `/` thành `-`.
- TODO mới: phát hiện mức độ liên quan review thông minh (P3), kỹ năng `/merge` cho PR merge được kiểm soát bởi review (P2).

## 0.5.0 — 2026-03-16

- **Trang web của bạn vừa được design review.** `/plan-design-review` mở trang web của bạn và xem xét nó như một nhà thiết kế sản phẩm cấp cao — typography, spacing, phân cấp, màu sắc, responsive, tương tác, và phát hiện AI slop. Nhận điểm chữ (A-F) cho mỗi danh mục, tiêu đề kép "Design Score" + "AI Slop Score", và ấn tượng đầu tiên có cấu trúc không né tránh sự thật.
- **Nó cũng có thể sửa những gì nó tìm thấy.** `/qa-design-review` chạy cùng một kiểm tra bằng mắt của nhà thiết kế, sau đó lặp lại sửa các vấn đề thiết kế trong source code của bạn với các commit `style(design):` nguyên tử và ảnh chụp màn hình trước/sau. CSS-safe theo mặc định, với heuristic tự điều chỉnh nghiêm ngặt hơn được điều chỉnh cho các thay đổi styling.
- **Biết hệ thống thiết kế thực tế của bạn.** Cả hai kỹ năng trích xuất phông chữ, màu sắc, tỷ lệ tiêu đề, và mẫu spacing của trang web trực tiếp của bạn qua JS — sau đó đề xuất lưu hệ thống được suy luận như một đường cơ sở `DESIGN.md`. Cuối cùng biết bạn thực sự đang sử dụng bao nhiêu phông chữ.
- **Phát hiện AI Slop là số liệu tiêu đề.** Mỗi báo cáo mở đầu với hai điểm: Design Score và AI Slop Score. Danh sách kiểm tra AI slop bắt 10 mẫu được tạo bởi AI dễ nhận biết nhất — lưới tính năng 3 cột, gradient tím, blob trang trí, đạn emoji, copy hero chung chung.
- **Theo dõi hồi quy thiết kế.** Báo cáo viết một `design-baseline.json`. Lần chạy tiếp theo so sánh tự động: delta điểm theo danh mục, phát hiện mới, phát hiện đã giải quyết. Xem điểm thiết kế của bạn cải thiện theo thời gian.
- **Danh sách kiểm tra thiết kế 80 mục** trên 10 danh mục: phân cấp trực quan, typography, màu sắc/tương phản, spacing/layout, trạng thái tương tác, responsive, chuyển động, nội dung/microcopy, AI slop, và hiệu suất-như-thiết-kế. Được chắt lọc từ 100+ quy tắc của Vercel, kỹ năng thiết kế frontend của Anthropic, và 6 framework thiết kế khác.

### Cho người đóng góp

- Đã thêm resolver `{{DESIGN_METHODOLOGY}}` vào `gen-skill-docs.ts` — phương pháp kiểm tra thiết kế chia sẻ được chèn vào cả template `/plan-design-review` và `/qa-design-review`, theo mẫu `{{QA_METHODOLOGY}}`.
- Đã thêm `~/.antidev-dev/plans/` như thư mục kế hoạch cục bộ cho các tài liệu tầm nhìn dài hạn (không được check in). CLAUDE.md và TODOS.md đã được cập nhật.
- Đã thêm `/setup-design-md` vào TODOS.md (P2) để tạo DESIGN.md tương tác từ đầu.

## 0.4.5 — 2026-03-16

- **Các phát hiện review giờ thực sự được sửa, không chỉ được liệt kê.** `/review` và `/ship` trước đây in các phát hiện thông tin (code chết, khoảng trống kiểm tra, truy vấn N+1) và sau đó bỏ qua chúng. Giờ mỗi phát hiện đều được hành động: các sửa chữa cơ học rõ ràng được áp dụng tự động, và các vấn đề thực sự mơ hồ được gộp thành một câu hỏi duy nhất thay vì 8 prompt riêng biệt. Bạn thấy `[AUTO-FIXED] file:line Problem → what was done` cho mỗi lần tự động sửa.
- **Bạn kiểm soát ranh giới giữa "chỉ sửa nó" và "hỏi tôi trước."** Code chết, comment lỗi thời, truy vấn N+1 được tự động sửa. Vấn đề bảo mật, race condition, quyết định thiết kế được đưa ra cho quyết định của bạn. Phân loại sống ở một nơi (`review/checklist.md`) để cả `/review` và `/ship` đều đồng bộ.

### Đã sửa

- **`$B js "const x = await fetch(...); return x.status"` giờ hoạt động.** Lệnh `js` trước đây bọc mọi thứ như một biểu thức — vì vậy `const`, dấu chấm phẩy, và code nhiều dòng đều bị hỏng. Giờ nó phát hiện các câu lệnh và sử dụng block wrapper, giống như `eval` đã làm.
- **Nhấp vào một tùy chọn dropdown không còn treo mãi mãi.** Nếu một agent thấy `@e3 [option] "Admin"` trong snapshot và chạy `click @e3`, antidev giờ tự động chọn tùy chọn đó thay vì treo trên một lần nhấp Playwright không thể thực hiện. Việc đúng chỉ xảy ra.
- **Khi click là công cụ sai, antidev cho bạn biết.** Nhấp vào một `<option>` qua CSS selector trước đây hết thời gian với lỗi Playwright bí hiểm. Giờ bạn nhận được: `"Use 'browse select' instead of 'click' for dropdown options."`

### Cho người đóng góp

- Đổi tên Gate Classification → Severity Classification (độ nghiêm trọng xác định thứ tự trình bày, không phải bạn có thấy prompt hay không).
- Mục Heuristic Fix-First được thêm vào `review/checklist.md` — phân loại chuẩn AUTO-FIX vs ASK.
- Bài kiểm tra xác thực mới: `Fix-First Heuristic exists in checklist and is referenced by review + ship`.
- Đã trích xuất các helper `needsBlockWrapper()` và `wrapForEvaluate()` trong `read-commands.ts` — được chia sẻ bởi cả lệnh `js` và `eval` (DRY).
- Đã thêm `getRefRole()` vào `BrowserManager` — hiển thị vai trò ARIA cho bộ chọn ref mà không thay đổi kiểu trả về của `resolveRef`.
- Trình xử lý click tự động định tuyến các ref `[role=option]` đến `selectOption()` qua `<select>` cha, với kiểm tra `tagName` DOM để tránh chặn các thành phần listbox tùy chỉnh.
- 6 bài kiểm tra mới: js nhiều dòng, dấu chấm phẩy, từ khóa câu lệnh, biểu thức đơn giản, tự động định tuyến tùy chọn, hướng dẫn lỗi tùy chọn CSS.

## 0.4.4 — 2026-03-16

- **Phiên bản mới được phát hiện trong vòng chưa đến một giờ, không phải nửa ngày.** Cache kiểm tra cập nhật được đặt thành 12 giờ, có nghĩa là bạn có thể bị mắc kẹt trên một phiên bản cũ cả ngày trong khi các phiên bản mới được phát hành. Giờ "bạn đang cập nhật" hết hạn sau 60 phút, vì vậy bạn sẽ thấy nâng cấp trong vòng một giờ. "Có nâng cấp" vẫn nhắc nhở trong 12 giờ (đó là mục đích).
- **`/antidev-upgrade` luôn kiểm tra thực sự.** Chạy `/antidev-upgrade` trực tiếp giờ bỏ qua cache và thực hiện kiểm tra mới so với GitHub. Không còn "bạn đang dùng phiên bản mới nhất" khi bạn không phải.

### Cho người đóng góp

- Chia TTL cache `last-update-check`: 60 phút cho `UP_TO_DATE`, 720 phút cho `UPGRADE_AVAILABLE`.
- Đã thêm flag `--force` vào `bin/antidev-update-check` (xóa file cache trước khi kiểm tra).
- 3 bài kiểm tra mới: `--force` phá vỡ cache UP_TO_DATE, `--force` phá vỡ cache UPGRADE_AVAILABLE, bài kiểm tra biên TTL 60 phút với `utimesSync`.

## 0.4.3 — 2026-03-16

- **Kỹ năng `/document-release` mới.** Chạy nó sau `/ship` nhưng trước khi merge — nó đọc mọi file tài liệu trong dự án của bạn, tham chiếu chéo diff, và cập nhật README, ARCHITECTURE, CONTRIBUTING, CHANGELOG, và TODOS để khớp với những gì bạn thực sự đã ship. Các thay đổi rủi ro được đưa ra dưới dạng câu hỏi; mọi thứ khác là tự động.
- **Mỗi câu hỏi giờ hoàn toàn rõ ràng, mỗi lần.** Bạn từng cần chạy 3+ phiên trước khi antidev cung cấp cho bạn đầy đủ ngữ cảnh và giải thích bằng tiếng Anh đơn giản. Giờ mỗi câu hỏi — ngay cả trong một phiên duy nhất — cho bạn biết dự án, nhánh, và những gì đang xảy ra, được giải thích đủ đơn giản để hiểu ngay cả khi đang chuyển ngữ cảnh. Không còn "xin lỗi, hãy giải thích đơn giản hơn cho tôi."
- **Tên nhánh luôn đúng.** antidev giờ phát hiện nhánh hiện tại của bạn tại thời gian chạy thay vì dựa vào snapshot từ khi cuộc trò chuyện bắt đầu. Chuyển nhánh giữa phiên? antidev theo kịp.

### Cho người đóng góp

- Đã gộp quy tắc ELI16 vào định dạng AskUserQuestion cơ sở — một định dạng thay vì hai, không có điều kiện `_SESSIONS >= 3`.
- Đã thêm phát hiện `_BRANCH` vào khối bash preamble (`git branch --show-current` với fallback).
- Đã thêm bài kiểm tra bảo vệ hồi quy cho phát hiện nhánh và quy tắc đơn giản hóa.

## 0.4.2 — 2026-03-16

- **`$B js "await fetch(...)"` giờ chỉ hoạt động.** Bất kỳ biểu thức `await` nào trong `$B js` hoặc `$B eval` đều được tự động bọc trong async context. Không còn `SyntaxError: await is only valid in async functions`. File eval một dòng trả về giá trị trực tiếp; file nhiều dòng sử dụng `return` rõ ràng.
- **Chế độ contributor giờ phản chiếu, không chỉ phản ứng.** Thay vì chỉ ghi báo cáo khi có gì đó hỏng, chế độ contributor giờ nhắc nhở phản chiếu định kỳ: "Đánh giá trải nghiệm antidev của bạn 0-10. Không phải 10? Hãy nghĩ tại sao." Bắt các vấn đề chất lượng cuộc sống và ma sát mà phát hiện thụ động bỏ lỡ. Báo cáo giờ bao gồm đánh giá 0-10 và "Điều gì làm cho điều này thành 10" để tập trung vào các cải tiến có thể thực hiện được.
- **Các kỹ năng giờ tôn trọng nhánh target của bạn.** `/ship`, `/review`, `/qa`, và `/plan-ceo-review` phát hiện nhánh mà PR của bạn thực sự target thay vì giả định `main`. Các nhánh xếp chồng, workspace Conductor targeting các nhánh tính năng, và repo sử dụng `master` đều chỉ hoạt động giờ.
- **`/retro` hoạt động trên bất kỳ nhánh mặc định nào.** Các repo sử dụng `master`, `develop`, hoặc các tên nhánh mặc định khác được phát hiện tự động — không còn retro trống vì tên nhánh sai.
- **Placeholder `{{BASE_BRANCH_DETECT}}` mới** cho tác giả kỹ năng — thả nó vào bất kỳ template nào và nhận phát hiện nhánh 3 bước (PR base → repo default → fallback) miễn phí.
- **3 bài kiểm tra smoke E2E mới** xác thực phát hiện nhánh cơ sở hoạt động end-to-end trên các kỹ năng ship, review, và retro.

### Cho người đóng góp

- Đã thêm helper `hasAwait()` với loại bỏ comment để tránh dương tính giả trên `// await` trong file eval.
- Bọc eval thông minh: một dòng → biểu thức `(...)`, nhiều dòng → khối `{...}` với `return` rõ ràng.
- 6 unit test bọc async mới, 40 bài kiểm tra xác thực preamble chế độ contributor mới.
- Ví dụ hiệu chỉnh được đóng khung là lịch sử ("từng thất bại") để tránh ngụ ý lỗi trực tiếp sau khi sửa.
- Đã thêm mục "Writing SKILL templates" vào CLAUDE.md — quy tắc về ngôn ngữ tự nhiên hơn bash-ism, phát hiện nhánh động, các khối code độc lập.
- Bài kiểm tra hồi quy hardcoded-main quét tất cả file `.tmpl` để tìm lệnh git với `main` được hardcode.
- Template QA được làm sạch: đã xóa biến shell `REPORT_DIR`, đơn giản hóa phát hiện cổng thành văn xuôi.
- Template antidev-upgrade: văn xuôi rõ ràng liên bước cho tham chiếu biến giữa các khối bash.

## 0.4.1 — 2026-03-16

- **antidev giờ nhận ra khi nó mắc lỗi.** Bật chế độ contributor (`antidev-config set antidev_contributor true`) và antidev tự động viết ra những gì đã xảy ra — bạn đang làm gì, điều gì bị hỏng, các bước tái hiện. Lần tiếp theo có gì đó làm bạn bực bội, báo cáo lỗi đã được viết. Fork antidev và tự sửa.
- **Đang xử lý nhiều phiên? antidev theo kịp.** Khi bạn có 3+ cửa sổ antidev mở, mỗi câu hỏi giờ cho bạn biết dự án nào, nhánh nào, và bạn đang làm gì. Không còn nhìn chằm chằm vào câu hỏi và nghĩ "khoan, cửa sổ này là cái nào?"
- **Mỗi câu hỏi giờ đi kèm với khuyến nghị.** Thay vì đổ các lựa chọn lên bạn và khiến bạn phải suy nghĩ, antidev cho bạn biết nó sẽ chọn gì và tại sao. Định dạng rõ ràng giống nhau trên mọi kỹ năng.
- **/review giờ bắt các bộ xử lý enum bị quên.** Thêm một hằng số trạng thái, bậc, hoặc loại mới? /review theo dõi nó qua mọi câu lệnh switch, allowlist, và filter trong codebase của bạn — không chỉ các file bạn đã thay đổi. Bắt lớp lỗi "đã thêm giá trị nhưng quên xử lý nó" trước khi chúng được ship.

### Cho người đóng góp

- Đã đổi tên `{{UPDATE_CHECK}}` thành `{{PREAMBLE}}` trên tất cả 11 template kỹ năng — một khối khởi động giờ xử lý kiểm tra cập nhật, theo dõi phiên, chế độ contributor, và định dạng câu hỏi.
- Đã DRY định dạng câu hỏi plan-ceo-review và plan-eng-review để tham chiếu đường cơ sở preamble thay vì sao chép quy tắc.
- Đã thêm hướng dẫn phong cách CHANGELOG và tài liệu nhận thức symlink vendored vào CLAUDE.md.

## 0.4.0 — 2026-03-16

### Đã thêm
- **Kỹ năng QA-only** (`/qa-only`) — chế độ QA chỉ báo cáo, tìm và ghi lại lỗi mà không thực hiện sửa chữa. Chuyển giao báo cáo lỗi sạch cho nhóm của bạn mà agent không chạm vào code của bạn.
- **Vòng lặp sửa lỗi QA** — `/qa` giờ chạy chu kỳ tìm-sửa-xác minh: khám phá lỗi, sửa chúng, commit, điều hướng lại để xác nhận bản sửa đã được áp dụng. Một lệnh để đi từ bị hỏng đến đã ship.
- **Luồng artifact Plan-to-QA** — `/plan-eng-review` viết các artifact kế hoạch kiểm tra mà `/qa` tự động nhận. Đánh giá kỹ thuật của bạn giờ đưa trực tiếp vào kiểm tra QA mà không cần copy-paste thủ công.
- **Placeholder DRY `{{QA_METHODOLOGY}}`** — khối phương pháp QA chia sẻ được chèn vào cả template `/qa` và `/qa-only`. Giữ cả hai kỹ năng đồng bộ khi bạn cập nhật tiêu chuẩn kiểm tra.
- **Số liệu hiệu quả eval** — lượt, thời gian, và chi phí giờ được hiển thị trên tất cả các bề mặt eval với bình luận **Takeaway** bằng ngôn ngữ tự nhiên. Xem ngay lập tức liệu các thay đổi prompt của bạn có làm agent nhanh hơn hay chậm hơn không.
- **Engine `generateCommentary()`** — diễn giải delta so sánh để bạn không phải làm: gắn cờ hồi quy, ghi chú cải tiến, và tạo tóm tắt hiệu quả tổng thể.
- **Cột danh sách eval** — `bun run eval:list` giờ hiển thị Turns và Duration cho mỗi lần chạy. Phát hiện ngay lập tức các lần chạy tốn kém hoặc chậm.
- **Hiệu quả per-test tóm tắt eval** — `bun run eval:summary` hiển thị lượt/thời gian/chi phí trung bình cho mỗi bài kiểm tra qua các lần chạy. Xác định những bài kiểm tra nào đang tiêu tốn nhiều nhất theo thời gian.
- **Unit test `judgePassed()`** — đã trích xuất và kiểm tra logic phán đoán pass/fail.
- **3 bài kiểm tra E2E mới** — rào cản không sửa của qa-only, vòng lặp sửa lỗi qa với xác minh commit, artifact kế hoạch kiểm tra plan-eng-review.
- **Phát hiện staleness của ref trình duyệt** — `resolveRef()` giờ kiểm tra số lượng phần tử để phát hiện ref lỗi sau khi mutation trang. Điều hướng SPA không còn gây ra timeout 30 giây trên các phần tử bị thiếu.
- 3 bài kiểm tra snapshot mới cho staleness ref.

### Đã thay đổi
- Prompt kỹ năng QA được tái cấu trúc với quy trình làm việc hai chu kỳ rõ ràng (tìm → sửa → xác minh).
- `formatComparison()` giờ hiển thị delta lượt và thời gian per-test cùng với chi phí.
- `printSummary()` hiển thị cột lượt và thời gian.
- `eval-store.test.ts` đã sửa lỗi assertion file `_partial` có sẵn.

### Đã sửa
- Staleness ref trình duyệt — các ref được thu thập trước khi mutation trang (ví dụ điều hướng SPA) giờ được phát hiện và thu thập lại. Loại bỏ một lớp lỗi QA không ổn định trên các trang web động.

## 0.3.9 — 2026-03-15

### Đã thêm
- **CLI `bin/antidev-config`** — giao diện get/set/list đơn giản cho `~/.antidev/config.yaml`. Được sử dụng bởi update-check và kỹ năng upgrade cho các cài đặt liên tục (auto_upgrade, update_check).
- **Kiểm tra cập nhật thông minh** — TTL cache 12 giờ (trước là 24 giờ), backoff snooze theo cấp số nhân (24 giờ → 48 giờ → 1 tuần) khi người dùng từ chối nâng cấp, tùy chọn config `update_check: false` để vô hiệu hóa kiểm tra hoàn toàn. Snooze đặt lại khi một phiên bản mới được phát hành.
- **Chế độ tự động nâng cấp** — đặt `auto_upgrade: true` trong config hoặc biến môi trường `ANTIDEV_AUTO_UPGRADE=1` để bỏ qua prompt nâng cấp và cập nhật tự động.
- **Prompt nâng cấp 4 tùy chọn** — "Yes, upgrade now", "Always keep me up to date", "Not now" (snooze), "Never ask again" (vô hiệu hóa).
- **Đồng bộ bản sao vendored** — `/antidev-upgrade` giờ phát hiện và cập nhật các bản sao vendored cục bộ trong dự án hiện tại sau khi nâng cấp bản cài đặt chính.
- 25 bài kiểm tra mới: 11 cho CLI antidev-config, 14 cho đường dẫn snooze/config trong update-check.

### Đã thay đổi
- Các phần nâng cấp/khắc phục sự cố README được đơn giản hóa để tham chiếu `/antidev-upgrade` thay vì các lệnh dài dán.
- Template kỹ năng upgrade được nâng lên v1.1.0 với quyền công cụ `Write` để chỉnh sửa config.
- Tất cả preamble SKILL.md được cập nhật với mô tả luồng nâng cấp mới.

## 0.3.8 — 2026-03-14

### Đã thêm
- **TODOS.md là nguồn sự thật duy nhất** — đã gộp `TODO.md` (lộ trình) và `TODOS.md` (ngắn hạn) thành một file được tổ chức theo kỹ năng/thành phần với thứ tự ưu tiên P0-P4 và một mục Đã hoàn thành.
- **`/ship` Bước 5.5: Quản lý TODOS.md** — tự động phát hiện các mục đã hoàn thành từ diff, đánh dấu chúng xong với chú thích phiên bản, đề xuất tạo/tổ chức lại TODOS.md nếu thiếu hoặc không có cấu trúc.
- **Nhận thức TODOS liên kỹ năng** — `/plan-ceo-review`, `/plan-eng-review`, `/retro`, `/review`, và `/qa` giờ đọc TODOS.md cho ngữ cảnh dự án. `/retro` thêm số liệu Sức khỏe Backlog (số lượng mở, mục P0/P1, churn).
- **`review/TODOS-format.md` được chia sẻ** — định dạng mục TODO chuẩn được tham chiếu bởi `/ship` và `/plan-ceo-review` để ngăn lệch định dạng (DRY).
- **Hệ thống trả lời Greptile 2 tầng** — Tầng 1 (thân thiện, diff nội tuyến + giải thích) cho phản hồi đầu tiên; Tầng 2 (cứng rắn, chuỗi bằng chứng đầy đủ + yêu cầu xếp hạng lại) khi Greptile gắn cờ lại sau phản hồi trước.
- **Template trả lời Greptile** — các template có cấu trúc trong `greptile-triage.md` cho các bản sửa (diff nội tuyến), đã sửa (những gì đã được làm), và dương tính giả (bằng chứng + đề xuất xếp hạng lại). Thay thế các phản hồi một dòng mơ hồ.
- **phát hiện leo thang — phát hiện leo thang antidev** — thuật toán rõ ràng để phát hiện các phản hồi antidev trước đó trên luồng bình luận và tự động leo thang lên Tầng 2.
- **Xếp hạng lại độ nghiêm trọng Greptile** — các phản hồi giờ bao gồm `**Suggested re-rank:**` khi Greptile phân loại sai độ nghiêm trọng.
- Các bài kiểm tra xác thực tĩnh cho tham chiếu `TODOS-format.md` qua các kỹ năng.

### Đã sửa
- **Lỗi append `.gitignore` bị nuốt im lặng** — `catch {}` trần trong `ensureStateDir()` được thay thế bằng im lặng chỉ ENOENT; các lỗi không phải ENOENT (EACCES, ENOSPC) được ghi vào `.antidev/browse-server.log`.

### Đã thay đổi
- `TODO.md` đã xóa — tất cả các mục được gộp vào `TODOS.md`.
- `/ship` Bước 3.75 và `/review` Bước 5 giờ tham chiếu template trả lời và phát hiện leo thang từ `greptile-triage.md`.
- `/ship` Bước 6 thứ tự commit bao gồm TODOS.md trong commit cuối cùng cùng với VERSION + CHANGELOG.
- `/ship` Bước 8 nội dung PR bao gồm mục TODOS.

## 0.3.7 — 2026-03-14

### Đã thêm
- **Cắt xén ảnh chụp màn hình phần tử/vùng** — lệnh `screenshot` giờ hỗ trợ cắt xén phần tử qua CSS selector hoặc @ref (`screenshot "#hero" out.png`, `screenshot @e3 out.png`), cắt xén vùng (`screenshot --clip x,y,w,h out.png`), và chế độ chỉ viewport (`screenshot --viewport out.png`). Sử dụng `locator.screenshot()` và `page.screenshot({ clip })` gốc của Playwright. Toàn trang vẫn là mặc định.
- 10 bài kiểm tra mới bao gồm tất cả các chế độ screenshot (viewport, CSS, @ref, clip) và đường dẫn lỗi (flag không xác định, loại trừ lẫn nhau, tọa độ không hợp lệ, xác thực đường dẫn, selector không tồn tại).

## 0.3.6 — 2026-03-14

### Đã thêm
- **Khả năng quan sát E2E** — file heartbeat (`~/.antidev-dev/e2e-live.json`), thư mục log per-run (`~/.antidev-dev/e2e-runs/{runId}/`), progress.log, transcript NDJSON per-test, transcript thất bại liên tục. Tất cả I/O không gây lỗi.
- **`bun run eval:watch`** — bảng điều khiển terminal trực tiếp đọc heartbeat + file eval một phần mỗi 1 giây. Hiển thị các bài kiểm tra đã hoàn thành, bài kiểm tra hiện tại với thông tin lượt/công cụ, phát hiện stale (>10 phút), `--tail` cho progress.log.
- **Lưu eval tăng dần** — `savePartial()` ghi `_partial-e2e.json` sau khi mỗi bài kiểm tra hoàn thành. Chống sự cố: kết quả một phần tồn tại sau các lần chạy bị hủy. Không bao giờ được dọn dẹp.
- **Chẩn đoán có thể đọc bằng máy** — các trường `exit_reason`, `timeout_at_turn`, `last_tool_call` trong JSON eval. Cho phép truy vấn `jq` cho các vòng lặp sửa tự động.
- **Kiểm tra trước kết nối API** — bộ E2E ném ngay lập tức khi ConnectionRefused trước khi tiêu ngân sách kiểm tra.
- **Phát hiện `is_error`** — `claude -p` có thể trả về `subtype: "success"` với `is_error: true` trên lỗi API. Giờ được phân loại đúng là `error_api`.
- **Parser NDJSON stream-json** — hàm thuần `parseNDJSON()` cho tiến trình E2E thời gian thực từ `claude -p --output-format stream-json --verbose`.
- **Lưu trữ eval** — kết quả được lưu vào `~/.antidev-dev/evals/` với tự động so sánh với lần chạy trước.
- **Công cụ CLI eval** — `eval:list`, `eval:compare`, `eval:summary` để kiểm tra lịch sử eval.
- **Tất cả 9 kỹ năng được chuyển đổi sang template `.tmpl`** — plan-ceo-review, plan-eng-review, retro, review, ship giờ sử dụng placeholder `{{UPDATE_CHECK}}`. Nguồn sự thật duy nhất cho preamble kiểm tra cập nhật.
- **Bộ eval 3 tầng** — Tầng 1: xác thực tĩnh (miễn phí), Tầng 2: E2E qua `claude -p` (~$3.85/lần chạy), Tầng 3: LLM-as-judge (~$0.15/lần chạy). Được kiểm soát bởi `EVALS=1`.
- **Kiểm tra kết quả planted-bug** — các fixture eval với lỗi đã biết, điểm phát hiện của LLM judge.
- 15 unit test quan sát bao gồm schema heartbeat, định dạng progress.log, đặt tên NDJSON, savePartial, finalize, hiển thị watcher, phát hiện stale, I/O không gây lỗi.
- Bài kiểm tra E2E cho các kỹ năng plan-ceo-review, plan-eng-review, retro.
- Bài kiểm tra hồi quy exit code kiểm tra cập nhật.
- `test/helpers/skill-parser.ts` — `getRemoteSlug()` để phát hiện git remote.

### Đã sửa
- **Khám phá binary browse bị hỏng cho agent** — thay thế gián tiếp `find-browse` bằng đường dẫn `browse/dist/browse` rõ ràng trong các khối setup SKILL.md.
- **Exit code 1 kiểm tra cập nhật gây hiểu lầm cho agent** — đã thêm `|| true` để ngăn exit khác không khi không có cập nhật.
- **browse/SKILL.md thiếu khối setup** — đã thêm placeholder `{{BROWSE_SETUP}}`.
- **Timeout plan-ceo-review** — khởi tạo repo git trong thư mục kiểm tra, bỏ qua khám phá codebase, tăng timeout lên 420 giây.
- Độ tin cậy eval planted-bug — đơn giản hóa prompt, hạ thấp đường cơ sở phát hiện, chống chịu với lỗi max_turns.

### Đã thay đổi
- **Hệ thống template được mở rộng** — placeholder `{{UPDATE_CHECK}}` và `{{BROWSE_SETUP}}` trong `gen-skill-docs.ts`. Tất cả các kỹ năng sử dụng browse được tạo từ nguồn sự thật duy nhất.
- Đã làm giàu 14 mô tả lệnh với định dạng arg cụ thể, các giá trị hợp lệ, hành vi lỗi, và các kiểu trả về.
- Khối setup kiểm tra đường dẫn cục bộ workspace trước (để phát triển), quay lại cài đặt toàn cục.
- LLM eval judge được nâng cấp từ Haiku lên Sonnet 4.6.
- `generateHelpText()` được tự động tạo từ COMMAND_DESCRIPTIONS (thay thế văn bản help được duy trì thủ công).

## 0.3.3 — 2026-03-13

### Đã thêm
- **Hệ thống template SKILL.md** — các file `.tmpl` với placeholder `{{COMMAND_REFERENCE}}` và `{{SNAPSHOT_FLAGS}}`, được tự động tạo từ source code tại thời gian build. Cấu trúc ngăn lệch lệnh giữa tài liệu và code.
- **Registry lệnh** (`browse/src/commands.ts`) — nguồn sự thật duy nhất cho tất cả lệnh browse với các danh mục và mô tả phong phú. Không có tác dụng phụ, an toàn để import từ script build và bài kiểm tra.
- **Metadata flag snapshot** (mảng `SNAPSHOT_FLAGS` trong `browse/src/snapshot.ts`) — parser dựa trên metadata thay thế switch/case được viết tay. Thêm flag ở một nơi cập nhật parser, tài liệu, và bài kiểm tra.
- **Xác thực tĩnh Tầng 1** — 43 bài kiểm tra: phân tích lệnh `$B` từ các khối code SKILL.md, xác thực so với registry lệnh và metadata flag snapshot
- **Bài kiểm tra E2E Tầng 2** qua Agent SDK — tạo các phiên Claude thực, chạy kỹ năng, quét lỗi browse. Được kiểm soát bởi biến môi trường `SKILL_E2E=1` (~$0.50/lần chạy)
- **Eval LLM-as-judge Tầng 3** — Haiku chấm điểm tài liệu được tạo về độ rõ ràng/đầy đủ/khả năng thực hiện (ngưỡng ≥4/5), cộng với bài kiểm tra hồi quy so với đường cơ sở được duy trì thủ công. Được kiểm soát bởi `ANTHROPIC_API_KEY`
- **`bun run skill:check`** — bảng điều khiển sức khỏe hiển thị tất cả kỹ năng, số lượng lệnh, trạng thái xác thực, độ tươi mới template
- **`bun run dev:skill`** — chế độ watch tái tạo và xác thực SKILL.md mỗi khi template hoặc file nguồn thay đổi
- **Quy trình CI** (`.github/workflows/skill-docs.yml`) — chạy `gen:skill-docs` khi push/PR, thất bại nếu đầu ra được tạo khác với các file đã commit
- Script `bun run gen:skill-docs` để tái tạo thủ công
- `bun run test:eval` cho eval LLM-as-judge
- `test/helpers/skill-parser.ts` — trích xuất và xác thực lệnh `$B` từ Markdown
- `test/helpers/session-runner.ts` — wrapper Agent SDK với quét mẫu lỗi và lưu transcript
- **ARCHITECTURE.md** — tài liệu quyết định thiết kế bao gồm mô hình daemon, bảo mật, hệ thống ref, ghi log, phục hồi sự cố
- **Tích hợp Conductor** (`conductor.json`) — hook vòng đời cho thiết lập/dọn dẹp workspace
- **Propagation `.env`** — `bin/dev-setup` sao chép `.env` từ worktree chính vào các workspace Conductor tự động
- Template `.env.example` để cấu hình API key

### Đã thay đổi
- Build giờ chạy `gen:skill-docs` trước khi biên dịch binary
- `parseSnapshotArgs` dựa trên metadata (lặp `SNAPSHOT_FLAGS` thay vì switch/case)
- `server.ts` import các bộ lệnh từ `commands.ts` thay vì khai báo inline
- SKILL.md và browse/SKILL.md giờ là các file được tạo (chỉnh sửa `.tmpl` thay thế)

## 0.3.2 — 2026-03-13

### Đã sửa
- Cookie import picker giờ trả về JSON thay vì HTML — `jsonResponse()` tham chiếu `url` ngoài phạm vi, gây lỗi mọi lần gọi API
- Lệnh `help` được định tuyến đúng (trước đây không thể tiếp cận do thứ tự dispatch META_COMMANDS)
- Các server lỗi thời từ cài đặt toàn cục không còn che khuất các thay đổi cục bộ — đã xóa fallback `~/.claude/skills/antidev` kế thừa khỏi `resolveServerScript()`
- Tham chiếu đường dẫn crash log được cập nhật từ `/tmp/` sang `.antidev/`

### Đã thêm
- **Chế độ QA có nhận thức diff** — `/qa` trên nhánh tính năng tự động phân tích `git diff`, xác định các trang/route bị ảnh hưởng, phát hiện ứng dụng đang chạy trên localhost, và chỉ kiểm tra những gì đã thay đổi. Không cần URL.
- **Trạng thái browse cục bộ dự án** — file state, log, và tất cả trạng thái server giờ nằm trong `.antidev/` bên trong thư mục gốc dự án (được phát hiện qua `git rev-parse --show-toplevel`). Không còn file state `/tmp`.
- **Module config chung** (`browse/src/config.ts`) — tập trung phân giải đường dẫn cho CLI và server, loại bỏ logic cổng/state bị sao chép
- **Chọn cổng ngẫu nhiên** — server chọn cổng ngẫu nhiên 10000-60000 thay vì quét 9400-9409. Không còn magic offset CONDUCTOR_PORT. Không còn va chạm cổng qua các workspace.
- **Theo dõi phiên bản binary** — file state bao gồm SHA `binaryVersion`; CLI tự động khởi động lại server khi binary được rebuild
- **Dọn dẹp /tmp kế thừa** — CLI quét và xóa các file `/tmp/browse-server*.json` cũ, xác minh quyền sở hữu PID trước khi gửi tín hiệu
- **Tích hợp Greptile** — `/review` và `/ship` tìm nạp và phân loại bình luận bot Greptile; `/retro` theo dõi tỷ lệ đúng của Greptile qua các tuần
- **Chế độ dev cục bộ** — `bin/dev-setup` symlink các kỹ năng từ repo để phát triển tại chỗ; `bin/dev-teardown` khôi phục cài đặt toàn cục
- Lệnh `help` — agent có thể tự khám phá tất cả lệnh và flag snapshot
- `find-browse` có nhận thức phiên bản với giao thức tín hiệu META — phát hiện binary lỗi thời và nhắc agent cập nhật
- Binary `browse/dist/find-browse` đã biên dịch với so sánh SHA git so với origin/main (cache 4 giờ)
- File `.version` được ghi tại thời gian build để theo dõi phiên bản binary
- Bài kiểm tra cấp route cho cookie picker (13 bài kiểm tra) và kiểm tra phiên bản find-browse (10 bài kiểm tra)
- Bài kiểm tra phân giải config (14 bài kiểm tra) bao gồm phát hiện git root, ghi đè BROWSE_STATE_FILE, ensureStateDir, readVersionHash, resolveServerScript, và phát hiện không khớp phiên bản
- Hướng dẫn tương tác trình duyệt trong CLAUDE.md — ngăn Claude sử dụng công cụ mcp\_\_claude-in-chrome\_\_\*
- CONTRIBUTING.md với quick start, giải thích chế độ dev, và hướng dẫn kiểm tra nhánh trong các repo khác

### Đã thay đổi
- Vị trí file state: `.antidev/browse.json` (trước là `/tmp/browse-server.json`)
- Vị trí file log: `.antidev/browse-{console,network,dialog}.log` (trước là `/tmp/browse-*.log`)
- Ghi file state nguyên tử: `.json.tmp` → đổi tên (ngăn đọc một phần)
- CLI truyền `BROWSE_STATE_FILE` đến server được tạo ra (server suy ra tất cả đường dẫn từ nó)
- Các khối setup SKILL.md phân tích tín hiệu META và xử lý `META:UPDATE_AVAILABLE`
- SKILL.md `/qa` giờ mô tả bốn chế độ (diff-aware, full, quick, regression) với diff-aware là mặc định trên các nhánh tính năng
- `jsonResponse`/`errorResponse` sử dụng đối tượng tùy chọn để ngăn nhầm lẫn tham số vị trí
- Script build biên dịch cả binary `browse` và `find-browse`, dọn dẹp file tạm `.bun-build`
- README được cập nhật với hướng dẫn thiết lập Greptile, ví dụ QA diff-aware, và transcript demo đã sửa

### Đã xóa
- Magic offset `CONDUCTOR_PORT` (`browse_port = CONDUCTOR_PORT - 45600`)
- Phạm vi quét cổng 9400-9409
- Fallback kế thừa đến `~/.claude/skills/antidev/browse/src/server.ts`
- `DEVELOPING_ANTIDEV.md` (đổi tên thành CONTRIBUTING.md)

## 0.3.1 — 2026-03-12

### Phase 3.5: Nhập cookie trình duyệt

- Lệnh `cookie-import-browser` — giải mã và nhập cookie từ các trình duyệt Chromium thực (Comet, Chrome, Arc, Brave, Edge)
- Giao diện web picker cookie tương tác được phục vụ từ browse server (giao diện tối, bố cục hai bảng, tìm kiếm domain, nhập/xóa)
- Nhập CLI trực tiếp với flag `--domain` để sử dụng không tương tác
- Kỹ năng `/setup-browser-cookies` để tích hợp Claude Code
- Truy cập macOS Keychain với timeout bất đồng bộ 10 giây (không chặn vòng lặp sự kiện)
- Cache AES key per-browser (một prompt Keychain mỗi trình duyệt mỗi phiên)
- Fallback DB lock: sao chép DB cookie bị khóa vào /tmp để đọc an toàn
- 18 unit test với các fixture cookie mã hóa

## 0.3.0 — 2026-03-12

### Phase 3: Kỹ năng /qa — kiểm tra QA có hệ thống

- Kỹ năng `/qa` mới với quy trình làm việc 6 giai đoạn (Khởi tạo, Xác thực, Định hướng, Khám phá, Ghi chép, Kết thúc)
- Ba chế độ: full (có hệ thống, 5-10 vấn đề), quick (smoke test 30 giây), regression (so sánh với đường cơ sở)
- Phân loại vấn đề: 7 danh mục, 4 mức độ nghiêm trọng, danh sách kiểm tra khám phá per-page
- Template báo cáo có cấu trúc với điểm sức khỏe (0-100, có trọng số trên 7 danh mục)
- Hướng dẫn phát hiện framework cho Next.js, Rails, WordPress, và SPA
- `browse/bin/find-browse` — khám phá binary DRY sử dụng `git rev-parse --show-toplevel`

### Phase 2: Trình duyệt nâng cao

- Xử lý dialog: tự động chấp nhận/từ chối, buffer dialog, hỗ trợ văn bản prompt
- Upload file: `upload <sel> <file1> [file2...]`
- Kiểm tra trạng thái phần tử: `is visible|hidden|enabled|disabled|checked|editable|focused <sel>`
- Ảnh chụp màn hình có chú thích với nhãn ref được phủ lên (`snapshot -a`)
- Diff snapshot so với snapshot trước đó (`snapshot -D`)
- Quét phần tử tương tác với cursor cho các phần tử có thể nhấp không phải ARIA (`snapshot -C`)
- Flag `wait --networkidle` / `--load` / `--domcontentloaded`
- Bộ lọc `console --errors` (chỉ lỗi + cảnh báo)
- `cookie-import <json-file>` với tự động điền domain từ URL trang
- CircularBuffer O(1) ring buffer cho các buffer console/network/dialog
- Flush buffer bất đồng bộ với Bun.write()
- Kiểm tra sức khỏe với page.evaluate + timeout 2 giây
- Bọc lỗi Playwright — thông báo có thể thực hiện được cho AI agent
- Tái tạo context bảo toàn cookie/storage/URL (sửa useragent)
- SKILL.md được viết lại như playbook theo hướng QA với 10 mẫu quy trình làm việc
- 166 bài kiểm tra tích hợp (trước là ~63)

## 0.0.2 — 2026-03-12

- Sửa lỗi cài đặt `/browse` cục bộ dự án — binary đã biên dịch giờ phân giải `server.ts` từ thư mục của nó thay vì giả sử có cài đặt toàn cục
- `setup` rebuild các binary lỗi thời (không chỉ các binary bị thiếu) và exit khác không nếu build thất bại
- Sửa lệnh `chain` nuốt lỗi thực từ các lệnh write (ví dụ timeout điều hướng được báo cáo là "Unknown meta command")
- Sửa vòng lặp khởi động lại không giới hạn trong CLI khi server liên tục bị lỗi trên cùng một lệnh
- Giới hạn các buffer console/network ở 50k mục (ring buffer) thay vì tăng không giới hạn
- Sửa lỗi flush đĩa dừng im lặng sau khi buffer đạt ngưỡng 50k
- Sửa `ln -snf` trong setup để tránh tạo symlink lồng nhau khi nâng cấp
- Sử dụng `git fetch && git reset --hard` thay vì `git pull` cho nâng cấp (xử lý force-push)
- Đơn giản hóa cài đặt: global-first với bản sao dự án tùy chọn (thay thế phương pháp submodule)
- Tái cấu trúc README: hero, trước/sau, transcript demo, phần khắc phục sự cố
- Sáu kỹ năng (đã thêm `/retro`)

## 0.0.1 — 2026-03-11

Phiên bản phát hành đầu tiên.

- Năm kỹ năng: `/plan-ceo-review`, `/plan-eng-review`, `/review`, `/ship`, `/browse`
- CLI trình duyệt headless với 40+ lệnh, tương tác dựa trên ref, daemon Chromium liên tục
- Cài đặt một lệnh như kỹ năng Claude Code (submodule hoặc global clone)
- Script `setup` để biên dịch binary và symlink kỹ năng

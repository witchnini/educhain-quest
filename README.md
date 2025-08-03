EduChain Quest

EduChain Quest là một nền tảng học tập được "game hóa" (gamified), xây dựng trên nền tảng công nghệ blockchain và tích hợp AI. Dự án này biến việc học thành một trò chơi nhập vai hấp dẫn, nơi người dùng có thể tham gia vào các "nhiệm vụ" (quests) để kiểm tra kiến thức, kiếm phần thưởng và nâng cao kỹ năng của mình trong một môi trường an toàn và minh bạch.

✨ Ý tưởng cốt lõi

Trong bối cảnh công nghệ phát triển nhanh chóng, nhu cầu học hỏi và cập nhật kiến thức liên tục ngày càng trở nên quan trọng. EduChain Quest ra đời với mục tiêu giải quyết vấn đề này bằng cách:

Game hóa việc học: Biến các bài kiểm tra kiến thức về lập trình, lịch sử và các lĩnh vực khác thành các nhiệm vụ đầy thử thách.

Học để kiếm tiền (Learn-to-Earn): Người dùng sẽ nhận được phần thưởng là token và vật phẩm kỹ thuật số (NFTs) sau khi hoàn thành nhiệm vụ.

Minh bạch và An toàn: Tận dụng công nghệ blockchain để ghi lại một cách minh bạch mọi giao dịch và quyền sở hữu vật phẩm của người chơi.

Tích hợp AI: Sử dụng các mô hình ngôn ngữ tiên tiến để tạo ra trải nghiệm học tập thông minh và tương tác hơn.

🚀 Chức năng chính

Hệ thống Nhiệm vụ (Quest System): Cung cấp các nhiệm vụ đa dạng về chủ đề và độ khó, từ "JavaScript Basics" đến "Advanced CSS Conundrum".

Hệ thống Phần thưởng (Reward System): Trao thưởng cho người chơi bằng tiền tệ trong game và các vật phẩm NFT độc đáo sau khi hoàn thành nhiệm vụ.

Tích hợp Blockchain: Sử dụng hợp đồng thông minh (Smart Contract) để quản lý logic game, tài sản và giao dịch một cách phi tập trung.

Giao diện trực quan: Giao diện người dùng thân thiện, dễ dàng theo dõi tiến trình, nhiệm vụ và tài sản.

🛠️ Công nghệ sử dụng

Frontend: Vite, React, TypeScript

Blockchain: Clarity, Stacks

AI: Google Gemini API

Runtime: Node.js

本地运行 (Chạy ứng dụng tại Local)

Phần hướng dẫn này chứa mọi thứ bạn cần để chạy ứng dụng trên máy của mình.

Điều kiện tiên quyết

Node.js

Hướng dẫn cài đặt

Clone a copy of the repo:

Generated bash
git clone https://github.com/witchnini/educhain-quest.git
cd educhain-quest


Cài đặt các gói phụ thuộc:

Generated bash
npm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Thiết lập biến môi trường:

Tạo một file mới tên là .env.local ở thư mục gốc của dự án.

Thêm khóa API của bạn vào file với định dạng sau:

Generated code
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Chạy ứng dụng:

Generated bash
npm run dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Ứng dụng của bạn sẽ chạy tại địa chỉ http://localhost:5174.

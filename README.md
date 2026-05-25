# LizAI - Hệ Thống Quản Lý Người Dùng

Dự án này được phát triển bằng Angular CLI phiên bản 21.2.9. Đây là một ứng dụng quản lý người dùng với các tính năng tìm kiếm thời gian thực, xử lý dữ liệu bất đồng bộ và tối ưu hóa trải nghiệm người dùng bằng Signals và RxJS.

## 1. Cấu hình môi trường (Environment Configuration)

Ứng dụng sử dụng các biến môi trường để quản lý các API endpoint khác nhau, giúp tách biệt cấu hình giữa lúc phát triển (Development) và lúc chạy thực tế (Production):

* **Môi trường Phát triển (`src/environments/environment.ts`):** Được sử dụng trong quá trình phát triển cục bộ (`ng serve`). Thư mục cấu hình chuẩn là `environments` (chú ý viết đúng chính tả để tránh lỗi build). File này thiết lập `production: false` và kết nối với API thử nghiệm.
* **Môi trường Thực tế (`src/environments/environment.prod.ts`):** Được sử dụng khi thực hiện build ứng dụng cho môi trường chạy thật (`ng build --configuration production`). Nó thiết lập `production: true` và kết nối với API chính thức.

**Lưu ý quan trọng:** Trong mã nguồn (các Service), luôn import cấu hình từ đường dẫn gốc `src/environments/environment`. Angular CLI sẽ tự động dựa vào cài đặt `fileReplacements` trong tệp `angular.json` để tráo đổi nội dung của file `.prod.ts` vào file gốc khi chạy lệnh build production.

## 2. Quy trình Build ứng dụng Angular

Để đóng gói ứng dụng phục vụ cho việc triển khai lên môi trường chạy thật, sử dụng câu lệnh sau trong terminal:

```bash
ng build --configuration production
```

**Quy trình build này tự động thực hiện các tối ưu hóa nâng cao:**
1.  **AOT Compilation (Ahead-of-Time):** Trình biên dịch của Angular tiến hành chuyển đổi toàn bộ mã HTML Templates và TypeScript thành mã JavaScript thuần trước khi trình duyệt của người dùng tải xuống, giúp ứng dụng khởi chạy ngay lập tức.
2.  **Bundling & Minification:** Gom hàng trăm file mã nguồn nhỏ lẻ thành một vài tệp sản phẩm chính (chunks). Quá trình này áp dụng kỹ thuật loại bỏ mã thừa không dùng tới (Tree-shaking) và nén chặt mã nguồn (xóa khoảng trắng, thu gọn tên biến) để giảm dung lượng file xuống mức thấp nhất.
3.  **Output Artifacts:** Các tệp tin sau khi tối ưu sẽ được xuất ra và lưu trữ tập trung tại thư mục `dist/liz-ai`. Đây là thư mục chứa toàn bộ tài nguyên static hoàn chỉnh để phân phối lên các dịch vụ lưu trữ đám mây.

## 3. Quy trình triển khai từng bước lên Vercel (Step-by-Step Deployment)

Ứng dụng được thiết lập cơ chế triển khai tự động (Continuous Deployment) thông qua việc liên kết với [Vercel](https://vercel.com). Các bước thực hiện chi tiết như sau:

### Bước 1: Đẩy mã nguồn lên GitHub
Sử dụng các lệnh Git cơ bản để cập nhật toàn bộ thay đổi mới nhất từ máy cục bộ lên nhánh `main` của repository trên GitHub:
```bash
git add .
git commit -m "docs: hoàn tất tài liệu hướng dẫn cấu hình và deploy"
git push origin main
```

### Bước 2: Khởi tạo và liên kết dự án trên Vercel
1. Truy cập vào trang quản trị Vercel, đăng nhập bằng tài khoản liên kết với GitHub.
2. Nhấp chọn nút **Add New** -> **Project**.
3. Tìm kiếm tên repository của dự án trong danh sách và nhấn **Import**.
4. Nền tảng Vercel sẽ tự động phân tích cấu trúc mã nguồn và nhận diện chính xác Framework Preset là **Angular**.

### Bước 3: Cấu hình lệnh cài đặt nâng cao (Build Settings)
Do dự án sử dụng Angular phiên bản mới, hệ thống quản lý gói của Vercel đôi khi gặp phải xung đột phiên bản nghiêm trọng giữa các package liên quan (Peer Dependencies Conflict). Để khắc phục, cần ghi đè lệnh cài đặt:
* Di chuyển tới mục **Project Settings** -> chọn **Build & Development Settings**.
* Tìm đến dòng **Install Command**, bật công tắc **Override** lên.
* Điền chính xác câu lệnh sau để bỏ qua kiểm tra xung đột nghiêm trọng:
  ```bash
  npm install --legacy-peer-deps
  ```

### Bước 4: Khắc phục lỗi điều hướng đường dẫn con (`vercel.json`)
Bản chất của Angular là ứng dụng đơn trang (Single Page Application - SPA). Khi người dùng truy cập trực tiếp hoặc bấm phím F5 làm mới trình duyệt tại các đường dẫn con (ví dụ: `/login`, `/register`), máy chủ Vercel sẽ cố gắng tìm kiếm các thư mục vật lý tương ứng và trả về lỗi `404 Not Found`.

Để giải quyết triệt để lỗi này, một file cấu hình tên là `vercel.json` đã được tạo trực tiếp tại thư mục gốc của dự án với nội dung cấu hình chuyển hướng (Rewrites) toàn bộ các request về file gốc `index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Bước 5: Kích hoạt triển khai thành phẩm
Nhấp chọn nút **Deploy**. Hệ thống máy chủ Vercel sẽ tải mã nguồn về, chạy các tiến trình cài đặt thư viện và build tối ưu hóa. Sau khoảng 1-2 phút, hệ thống sẽ cấp một đường dẫn URL chính thức ở dạng `https://xxx.vercel.app` hoạt động ổn định trên toàn mạng Internet.
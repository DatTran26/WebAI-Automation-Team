# Hướng Dẫn Khởi Chạy Dự Án (LIKEFOOD E-commerce)

Dự án này bao gồm 2 phần chính:
- **Frontend**: Ứng dụng Next.js (nằm trong thư mục `frontend`)
- **Backend/Database**: Prisma ORM và scripts quản lý CSDL (nằm trong thư mục `backend`)
- **Dịch vụ bên ngoài**: Sử dụng Supabase (cho Authentication và Database)

Dưới đây là các bước chi tiết để cấu hình và khởi chạy dự án trên môi trường local của bạn.

---

## Bước 1: Cài đặt Node.js và các công cụ cần thiết
- Đảm bảo bạn đã cài đặt Node.js (phiên bản 18.x hoặc 20.x trở lên).
- Trình quản lý gói `npm` (hoặc `yarn`, `pnpm` tùy sở thích, hướng dẫn này sử dụng `npm`).

## Bước 2: Cấu hình biến môi trường (Environment Variables)

Bạn cần tạo các file biến môi trường cho cả Frontend và Backend.

### 2.1 Tại thư mục `backend`
1. Di chuyển vào thư mục `backend`.
2. Tạo file `.env` (hoặc copy từ `.env.example` nếu có).
3. Đảm bảo file `.env` có chứa `DATABASE_URL` trỏ tới cơ sở dữ liệu PostgreSQL của bạn (ví dụ: Supabase PostgreSQL).
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
   ```

### 2.2 Tại thư mục `frontend`
1. Di chuyển vào thư mục `frontend`.
2. Tạo file `.env.local`.
3. Điền các biến môi trường cấu hình cho Supabase và API (ví dụ):
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
   ```

---

## Bước 3: Cài đặt Dependencies

Mở 2 cửa sổ terminal để cài đặt thư viện cho frontend và backend.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

---

## Bước 4: Khởi tạo Cơ sở Dữ liệu (Database Setup)

Sau khi đã cài đặt dependencies cho backend và lấy đúng chuỗi kết nối database trong `backend/.env`, hãy tiến hành khởi tạo CSDL:

1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Đồng bộ hóa Schema của Prisma lên cơ sở dữ liệu:
   ```bash
   npm run db:push
   ```
   *(Hoặc bạn có thể dùng `npm run db:migrate` nếu sử dụng cơ chế migration)*
3. Khởi tạo Prisma Client để truy xuất dữ liệu:
   ```bash
   npm run db:generate
   ```
4. Đẩy dữ liệu mẫu (Seed Data) vào CSDL (để có sẵn sản phẩm, danh mục,... test dApp):
   ```bash
   npm run db:seed
   ```

---

## Bước 5: Khởi chạy Ứng dụng

Sau khi cơ sở dữ liệu đã sẵn sàng, bạn hãy chạy môi trường phát triển (Development Server) cho Frontend.

1. Di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Chạy ứng dụng Next.js:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt và truy cập vào [http://localhost:3000](http://localhost:3000) (hoặc port được báo trên terminal).

---

## Các lệnh thao tác với Database (trong thư mục `backend`)
- `npm run db:studio`: Mở giao diện web (Prisma Studio) để xem/sửa Database trực quan.
- `npm run db:reset`: Thao tác reset lại toàn bộ DB và seed lại dữ liệu (Cẩn thận khi dùng).
- `npm run db:push`: Đẩy các thay đổi schema mới nhất lên DB.
- `npm run db:generate`: Cập nhật Prisma Client sau mỗi lần thay đổi schema.

---

## Dùng PostgreSQL trên pgAdmin

Nếu bạn muốn quản lý cơ sở dữ liệu bằng phần mềm **pgAdmin**, bạn có thể kết nối dựa trên chuỗi kết nối (`DATABASE_URL` hoặc `DIRECT_URL`) mà bạn đã thiết lập trong `backend/.env`.

1. **Chuẩn bị thông tin kết nối:**
   Từ chuỗi `postgresql://<user>:<password>@<host>:<port>/<dbname>`, bạn sẽ lấy được các thông tin sau:
   - **Host name/address:** Phần `<host>` (ví dụ: `aws-0-ap-southeast-1.pooler.supabase.com`)
   - **Port:** Phần `<port>` (mặc định là `5432` hoặc `6543`)
   - **Maintenance database:** Phần `<dbname>` (thường là `postgres`)
   - **Username:** Phần `<user>` (ví dụ: `postgres.xxxxxxx`)
   - **Password:** Phần `<password>` của bạn.

2. **Thêm Server trên pgAdmin:**
   - Mở ứng dụng **pgAdmin 4**.
   - Chuột phải vào **Servers** -> Chọn **Register** -> **Server...**
   - **Tab General**: Đặt `Name` bất kỳ cho kết nối (vd: `LIKEFOOD Supabase`).
   - **Tab Connection**:
     - Điền **Host name/address**
     - Điền **Port**
     - Điền **Maintenance database**
     - Điền **Username**
     - Điền **Password** và tích chọn "Save password".
     - *(Nếu dùng Supabase và port 6543 (pooler session), bạn có thể cần sang tab **Advanced** (hoặc **SSL**) và chỉnh **SSL mode** thành `Require` nếu quá trình kết nối bị lỗi).*
   - Nhấn **Save** để kết nối. Sau khi kết nối thành công, bạn có thể xem các bảng (tables) trong phần `Databases -> postgres -> Schemas -> public -> Tables`.

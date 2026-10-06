export const TRACKING_DOCUMENTATION_MD = `# TÀI LIỆU KẾ HOẠCH TRACKING & CHIẾN LƯỢC TỐI ƯU DỮ LIỆU
**Dự án:** StretchActive™ Ultra-Stretch Ice Silk Pants (D2C E-Commerce Landing Page)  
**Tác giả:** Đội ngũ Kỹ thuật & Data Tracking  
**Phiên bản:** v1.0 — Chuẩn tích hợp GTM / GA4 / Meta Pixel / TikTok Pixel  
**Ngày cập nhật:** Tháng 10/2026  

---

## I. MỤC TIÊU ĐO LƯỜNG & KHUNG CHỈ SỐ DOANH NGHIỆP (MEASUREMENT FRAMEWORK)

### 1. North Star Metric & Mục tiêu cốt lõi
* **North Star Metric:** **Net Revenue per Visitor (Doanh thu thuần trên mỗi lượt truy cập - RPV)** = \`(Conversion Rate × AOV)\`.
* **Mục tiêu đo lường:** Không chỉ ghi nhận số liệu bề nổi (Pageview, Click), mà phải giải mã chính xác **rào cản tâm lý người mua**, **hiệu quả gói combo (Bundle Tier)** và **độ hấp thụ của ưu đãi Upsell (+30%)\`**.

### 2. Tháp chỉ số phân cấp (KPI Hierarchy)

| Cấp độ | Tên chỉ số | Công thức / Ý nghĩa | Ngưỡng mục tiêu (Benchmark D2C) |
| :--- | :--- | :--- | :--- |
| **Tier 1: Macro KPI** | **Overall CR** | \`Users Purchase / Total Unique Visitors\` | 3.5% – 5.0% |
| | **AOV** | \`Tổng Doanh thu / Số đơn hàng thành công\` | > $85.00 |
| | **UPT** | \`Tổng số quần bán / Số đơn hàng\` | > 2.2 chiếc/đơn |
| **Tier 2: Funnel KPI** | **Product Engagement Rate** | \`Users (Xem/Chọn Màu/Size/Bundle) / Visitors\` | > 65% |
| | **Add-to-Cart (ATC) Rate** | \`Users Thêm giỏ / Unique Visitors\` | > 18% – 25% |
| | **Cart-to-Checkout Rate** | \`Users Bắt đầu Checkout / Users Thêm giỏ\` | > 60% |
| | **Checkout Completion Rate** | \`Users Hoàn tất đơn / Users Bắt đầu Checkout\` | > 70% |
| **Tier 3: Micro/CRO KPI**| **Upsell Take Rate** | \`Clicks 'Select now' / Hiển thị Box Upsell giỏ\` | > 28% – 35% |
| | **Bundle Tier Mix** | Tỷ trọng đơn chọn Bundle 2+1 & Bundle 3+2 | > 60% tổng đơn hàng |
| | **Review Interaction Rate** | Tỷ lệ khách lọc sao / xem đánh giá thực tế | > 15% |

---

## II. KIẾN TRÚC HỆ THỐNG TRACKING (TECH STACK & ARCHITECTURE)

\`\`\`
                [ Khách hàng tương tác trên Landing Page ]
                                    │
                                    ▼
                     [ tracking.ts (Event Bus Router) ]
    ┌───────────────────────┬───────────────────────┬───────────────────────┐
    ▼                       ▼                       ▼                       ▼
[ Google Tag Manager ]  [ Google Analytics 4 ]  [ Meta Pixel (CAPI) ]   [ TikTok Pixel ]
  dataLayer.push()        gtag('event', ...)       fbq('track', ...)       ttq.track(...)
    │                       │                       │                       │
    └───────────────────────┴───────────────────────┴───────────────────────┘
                                    │
                                    ▼
               [ Live Tracking Inspector & Audit Console ]
            (Lưu trữ localStorage, Phân tích phễu nhị phân +1/0)
\`\`\`

### 1. Cơ chế Định danh người dùng (Identity Resolution)
* **Client-Side Refresh (\`F5\`):** Mỗi lần làm mới trình duyệt, \`userId\` và \`sessionId\` mới được sinh ngẫu nhiên định dạng \`usr_xxxx\` và \`sess_xxxx\`. Giỏ hàng được reset trắng (\`cart = []\`) để bảo đảm trạng thái kiểm thử mới hoàn toàn.
* **Persistent Event Storage:** Lịch sử sự kiện cũ được nối tiếp (\`append-only\`) vào kho lưu trữ cục bộ, cho phép kiểm chứng hành vi giữa các phiên truy cập khác nhau của cùng thiết bị mà không bị ghi đè dữ liệu.
* **Quy chuẩn Nhị phân Funnel (+1 / 0):** Mỗi người dùng duy nhất (\`userId\`) chỉ được tính tối đa **1 lần** cho mỗi tầng phễu, triệt tiêu hoàn toàn lỗi đếm trùng sự kiện dẫn đến tỷ lệ ảo > 100%.

---

## III. MA TRẬN DỮ LIỆU SỰ KIỆN (TRACKING EVENT DATA DICTIONARY)

Hệ thống đã thiết lập chuẩn hóa 100% schema sự kiện tương thích với GA4 E-Commerce, Meta Pixel Standard Events và TikTok Pixel Events:

| STT | Event Name | Hành động kích hoạt (Trigger) | Meta Pixel | TikTok Pixel | Các tham số Payload bắt buộc |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | \`page_view\` | Khi trang tải xong lần đầu | \`PageView\` | \`PageView\` | \`page_title\`, \`page_location\`, \`device_type\` |
| **2** | \`view_item\` | Khi xem khối sản phẩm StretchActive | \`ViewContent\` | \`ViewContent\` | \`item_id\`, \`item_name\`, \`price\`, \`currency\`, \`style\` |
| **3** | \`customize_product\` | Chọn đổi màu sắc, size vòng eo hoặc style | \`CustomEvent\` | \`ClickButton\` | \`color\`, \`size\`, \`style\`, \`step: 'configurator'\` |
| **4** | \`customize_inseam\` | Chọn chiều dài ống quần (Inseam) | \`CustomEvent\` | \`ClickButton\` | \`inseam: '28' \\| '30' \\| '32' \\| '34'\` |
| **5** | \`select_bundle\` | Bấm chọn gói combo (1 quần, 2+1, 3+2) | \`CustomEvent\` | \`SelectContent\` | \`bundle_id\`, \`bundle_name\`, \`saving_percentage\`, \`price\` |
| **6** | \`add_to_cart\` | Bấm nút "Add to Cart" hoặc "Claim Offer" | \`AddToCart\` | \`AddToCart\` | \`currency\`, \`value\`, \`items: [{ item_id, quantity, price, size, color }]\` |
| **7** | \`view_cart\` | Mở thanh trượt giỏ hàng (Cart Drawer) | \`CustomEvent\` | \`ViewContent\` | \`cart_total\`, \`items_count\` |
| **8** | \`upsell_impression\`| Box ưu đãi độc quyền trong giỏ xuất hiện | \`CustomEvent\` | \`ViewContent\` | \`promo_id: 'UPGRADE-WATER-REPELLENT-30'\`, \`discount: 30\` |
| **9** | \`upsell_click\` | Bấm "Select now" trong giỏ hàng | \`CustomEvent\` | \`ClickButton\` | \`promo_id\`, \`applied_value: 9.95\`, \`target_item\` |
| **10**| \`begin_checkout\` | Bấm nút "Proceed to Checkout" trong giỏ | \`InitiateCheckout\`| \`InitiateCheckout\`| \`value\`, \`currency\`, \`num_items\`, \`items: [...]\` |
| **11**| \`add_shipping_info\`| Điền/Chọn địa chỉ trong Modal Checkout | \`AddShippingInfo\` | \`AddShippingInfo\` | \`shipping_tier: 'free' \\| 'express'\`, \`value\` |
| **12**| \`add_payment_info\` | Chọn hình thức thanh toán (Thẻ / PayPal) | \`AddPaymentInfo\` | \`AddPaymentInfo\` | \`payment_type: 'credit_card' \\| 'paypal'\` |
| **13**| \`purchase\` | Bấm xác nhận thanh toán thành công | \`Purchase\` | \`CompletePayment\` | \`transaction_id\`, \`value\`, \`tax\`, \`shipping\`, \`currency: 'USD'\`, \`items: [...]\` |
| **14**| \`review_interaction\`| Lọc số sao đánh giá (5★, 4★) hoặc xem tab | \`CustomEvent\` | \`SelectContent\` | \`filter_star\`, \`component: 'customer_reviews'\` |

---

## IV. MÔ HÌNH PHÂN TÍCH PHỄU CHUYỂN ĐỔI (FUNNEL MEASUREMENT MODEL)

### 1. Phễu 5 Bước Đo Lường Nhị Phân (Binary Funnel)
\`\`\`
[ Tầng 1: Vào Trang (100%) ] ─────── PageView
        │
        ▼ (Drop-off 1)
[ Tầng 2: Tương Tác SP ] ────────── view_item / customize / bundle
        │
        ▼ (Drop-off 2: Điểm nghẽn phổ biến nhất của E-commerce)
[ Tầng 3: Thêm Giỏ Hàng ] ───────── add_to_cart
        │
        ▼ (Drop-off 3)
[ Tầng 4: Bắt Đầu Checkout ] ────── begin_checkout / add_shipping
        │
        ▼ (Drop-off 4)
[ Tầng 5: Mua Hàng Thành Công ] ─── purchase (Ghi nhận Doanh thu & AOV)
\`\`\`

### 2. Thuật toán chẩn đoán điểm nghẽn tự động (Automated CRO Engine)
Hệ thống tính toán tốc độ hao hụt tương đối tại từng bước:
Drop Rate = (U_k - U_{k+1}) / U_k

* **Nếu điểm nghẽn tại Tầng 2 ➔ 3 (Rớt > 70%):** Người dùng quan sát sản phẩm nhưng ngần ngại bấm thêm giỏ.  
  * *Hành động đề xuất:* Nâng cao FOMO (Stock counter còn 4 chiếc), gắn bảo hành "60-Day Wear Test Free Return" ngay sát cụm nút bấm mua.
* **Nếu điểm nghẽn tại Tầng 3 ➔ 4 (Rớt > 40%):** Khách đã thích sản phẩm nhưng chững lại trong giỏ hàng.  
  * *Hành động đề xuất:* Bổ sung nút thanh toán nhanh 1-chạm (Apple Pay / Google Pay / PayPal Express) ngay trong Cart Drawer; làm rõ thanh đo tiến trình "Thêm $10 để Free Shipping".
* **Nếu điểm nghẽn tại Tầng 4 ➔ 5 (Rớt > 30%):** Khách dừng bước ở form điền địa chỉ hoặc nhập thẻ.  
  * *Hành động đề xuất:* Tinh giản form xuống tối đa 3 trường; làm nổi bật chứng chỉ bảo mật mã hóa SSL 256-bit.

---

## V. QUY TRÌNH KIỂM THỬ (QA PROTOCOL & AUDIT CHECKLIST)

Khi vận hành chiến dịch thực tế, nhân sự Media Buyer / Data Analyst thực hiện kiểm tra 4 bước trên **Live Tracking Inspector**:

1. **Kiểm tra trạng thái kích hoạt Pixel:**
   * Mở modal console ở góc dưới màn hình.
   * Xác nhận huy hiệu xanh \`4 Pixels Active (GTM · GA4 · Meta · TikTok)\` đang sáng.
2. **Kiểm tra luồng sự kiện (Live Event Log):**
   * Thao tác đổi màu ➔ Kiểm tra event \`customize_product\` xuất hiện ngay lập tức với đủ thông tin màu sắc và kích cỡ.
   * Thêm giỏ hàng ➔ Kiểm tra event \`add_to_cart\` có chứa đúng mảng \`items\` và \`value\`.
   * Bấm "Select now" ưu đãi ➔ Kiểm tra event \`upsell_click\` được ghi nhận.
3. **Kiểm tra tính toàn vẹn của Bảng Phễu Chuyển Đổi:**
   * Đảm bảo tỷ lệ chuyển đổi không vượt quá 100%.
   * Xác nhận số lượng User trong tab **"Kiểm Chứng Từng User"** hiển thị chính xác các cờ đánh dấu \`[1]\` hoặc \`[0]\` theo đúng tương tác thực tế của khách hàng.
4. **Kiểm tra sau khi thanh toán:**
   * Đảm bảo doanh thu cộng dồn chính xác theo công thức: \`Giá gói Bundle + Phí nâng cấp Upsell (nếu có)\`.
`;

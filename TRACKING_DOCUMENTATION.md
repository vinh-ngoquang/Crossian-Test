# TÀI LIỆU KẾ HOẠCH TRACKING & PHÂN TÍCH HÀNH VI NGƯỜI DÙNG
**Dự án:** StretchActive™ Ultra-Stretch Ice Silk Pants (D2C E-Commerce Landing Page)  
**Vai trò:** Tài liệu Đặc tả Dữ liệu Dành cho Data Analyst / Business Analyst  
**Phiên bản:** v2.1 (Cập nhật chính xác cơ chế Mua Nhiều Giảm Giá - Buy More Save More)  

---

## I. MỤC TIÊU ĐO LƯỜNG & KHUNG CHỈ SỐ DOANH NGHIỆP (BUSINESS METRICS FRAMEWORK)

### 1. Cặp Chỉ Số North Star (North Star Metrics)
Dự án xác định **cặp chỉ số song hành North Star** làm kim chỉ nam đo lường hiệu quả kinh doanh của toàn bộ Landing Page:

$$\text{Doanh Thu Kỳ Vọng / Lượt Ghé Thăm (RPV)} = \mathbf{CR} \times \mathbf{AOV}$$

* **CR (Conversion Rate - Tỷ lệ chuyển đổi):** Đo lường năng lực thuyết phục của Landing Page trong việc biến một lượt ghé thăm (Visitor) thành người mua hàng thực tế (Buyer).
* **AOV (Average Order Value - Giá trị đơn hàng trung bình):** Đo lường quy mô giá trị kinh tế trung bình của mỗi đơn hàng, phản ánh hiệu quả của chính sách kích cầu mua nhiều quần (*Buy More Save More: Mua chiếc tiếp theo giảm thêm 25% & Miễn phí vận chuyển từ $50*) 

---

### 2. Tháp Chỉ Số Phân Cấp Dành Cho Data Analyst

| Cấp độ phân tích | Tên chỉ số | Công thức tính toán | Mục tiêu D2C | Ý nghĩa phân tích kinh doanh |
| :--- | :--- | :--- | :--- | :--- |
| **North Star #1** | **Overall CR** | $\frac{\text{Số User Mua Hàng}}{\text{Tổng Số User Vào Trang}} \times 100\%$ | **3.5% – 5.0%** | Năng lực chốt đơn tổng thể trên toàn bộ hành trình. |
| **North Star #2** | **AOV** | $\frac{\text{Tổng Doanh Thu Đơn Hàng}}{\text{Tổng Số Đơn Hàng Thành Công}}$ | **> $60.00 – $85.00** | Giá trị trung bình của mỗi giỏ hàng xuất kho. |
| **Chỉ số Quy mô** | **UPT (Units Per Order)** | $\frac{\text{Tổng Số Lượng Quần Bán Ra}}{\text{Tổng Số Đơn Hàng}}$ | **> 1.8 – 2.4 chiếc** | Động lực thúc đẩy AOV nhờ ưu đãi giảm 25% cho chiếc kế tiếp và mốc Free Ship $50. |
| **Chỉ số Gia tăng** | **Upsell Take Rate** | $\frac{\text{Số Lần Bấm Mua Upsell}}{\text{Số Lần Nhìn Thấy Box Upsell}}$ | **28% – 35%** | Mức độ hấp dẫn của ưu đãi nâng cấp chống thấm (+30% / $9.95). |
| **Chỉ số Mua nhiều**| **Multi-Item Order Rate**| $\frac{\text{Số Đơn Hàng Mua Từ 2 Quần Trở Lên}}{\text{Tổng Số Đơn Hàng}} \times 100\%$ | **> 45%** | Đo lường hiệu quả của chương trình "Buy More Save More". |
| **Chỉ số Tương tác**| **Product Engagement** | $\frac{\text{User Chọn Màu / Size / Số Lượng}}{\text{Tổng Số User Vào Trang}}$ | **> 65%** | Mức độ quan tâm và sẵn sàng tìm hiểu sản phẩm. |
| **Chỉ số Rơi rụng** | **Cart Abandonment Rate**| $\frac{\text{User Thêm Giỏ Nhưng Không Mua}}{\text{Tổng User Có Thêm Giỏ}} \times 100\%$ | **< 60%** | Đo lường rào cản tâm lý về giá, phí ship hoặc tính cấp bách. |
| **Chỉ số Rơi rụng** | **Checkout Drop Rate** | $\frac{\text{User Bắt Đầu Form Nhưng Bỏ Dở}}{\text{Tổng User Bắt Đầu Checkout}} \times 100\%$ | **< 30%** | Đo lường độ phức tạp của form thanh toán và độ tin cậy. |

---

## II. MA TRẬN TỪ ĐIỂN DỮ LIỆU SỰ KIỆN (ANALYTICAL DATA DICTIONARY)

Hệ thống sự kiện được thiết kế phục vụ trực tiếp cho việc trích xuất báo cáo, phân khúc khách hàng và phân tích hành vi (User Behavioral Analysis):

| STT | Tên Sự Kiện (Event Name) | Hành Vi Người Dùng (User Action) | Mục Đích Phân Tích (Analytical Purpose) | Các Trường Dữ Liệu Đo Lường (Dimensions & Metrics) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `page_view` | Khách truy cập vào Landing Page | Đo lường dung lượng khách mới, tỷ lệ giữ chân (Retention) tại cửa ngõ đầu vào. | `page_title`, `device_type`, `referrer`, `traffic_source` |
| **2** | `view_item` | Cuộn đến và xem khu vực sản phẩm chính | Xác định tỷ lệ chuyển tiếp từ xem chung sang tìm hiểu sản phẩm chi tiết. | `item_id`, `item_name`, `style`, `base_price` ($31.49) |
| **3** | `customize_product` | Nhấp chọn màu sắc, kích thước eo hoặc kiểu dáng | Phân tích thị hiếu mẫu mã (Top Color / Top Size) để tối ưu tồn kho và hình ảnh hiển thị. | `color` (Đen/Ghi/Xanh/Rêu), `size` (S/M/L/XL/4XL), `style` (Straight/Jogger) |
| **4** | `customize_inseam` | Chọn chiều dài ống quần (Inseam) | Đánh giá nhu cầu thể hình khách hàng theo chiều dài chân. | `inseam` (Petite, Regular, Tall) |
| **5** | `update_quantity` | Tăng/giảm số lượng quần bằng nút +/- | Đo lường ý định mua số lượng nhiều trước khi bấm thêm giỏ. | `quantity` (1, 2, 3, 4...), `estimated_total` |
| **6** | `add_to_cart` | Bấm nút "Add to Cart" | Xác định ý định mua hàng rõ ràng (High Purchase Intent) để tính ATC Rate. | `quantity`, `unit_price`, `cart_value`, `qualifies_for_free_shipping` |
| **7** | `view_cart` | Mở xem giỏ hàng trượt | Đo lường mức độ kiểm tra lại quyết định chi tiêu trước khi checkout. | `cart_total`, `items_count`, `is_free_shipping_eligible` (đạt $50+) |
| **8** | `upsell_impression`| Box ưu đãi bổ sung xuất hiện trong giỏ | Đo lường số lượt hiển thị cơ hội gia tăng giá trị đơn hàng (Impressions). | `promo_id`, `offer_type: 'cross_sell'`, `discount_rate: 30` |
| **9** | `upsell_click` | Bấm "Select now" nhận ưu đãi nâng cấp | Tính toán trực tiếp tỷ lệ chấp nhận Upsell và tác động cộng dồn vào AOV. | `applied_value: 9.95`, `promo_id`, `product_category` |
| **10**| `begin_checkout` | Bấm tiến hành đặt hàng | Đo lường chuyển dịch từ giỏ hàng sang phễu thanh toán chính thức. | `checkout_value`, `num_items`, `applied_discount` |
| **11**| `add_shipping_info`| Hoàn thành bước nhập địa chỉ giao hàng | Phân tích khu vực địa lý đặt hàng và hình thức vận chuyển được chọn. | `shipping_tier` (free/express), `city`, `district` |
| **12**| `add_payment_info` | Chọn phương thức thanh toán | Phân tích thói quen thanh toán (Thẻ tín dụng / PayPal / COD). | `payment_method` (credit_card/paypal), `has_discount_applied` |
| **13**| `purchase` | Xác nhận đặt hàng thành công | Sự kiện chốt chặn doanh thu: tính toán chính xác CR, AOV, UPT và Net Revenue. | `transaction_id`, `total_revenue`, `num_items`, `items_list` |
| **14**| `review_interaction`| Lọc xem đánh giá 5 sao, 4 sao hoặc ảnh review | Đo lường vai trò của Social Proof (bằng chứng xã hội) đối với quyết định chốt đơn. | `star_filter` (5/4/3), `has_photo_filter`, `scroll_depth` |

---

## III. MÔ HÌNH PHÂN TÍCH PHỄU CHUYỂN ĐỔI (FUNNEL MEASUREMENT MODEL)

### 1. Nguyên Lý Đếm Nhị Phân Dành Cho Data Analyst (+1 / 0)
Để phản ánh chính xác tỷ lệ chuyển đổi mà không bị biến dạng số liệu khi một người dùng thao tác nhiều lần:
* **Đơn vị phân tích:** Khách hàng độc nhất (`Unique User ID`).
* **Quy tắc gán giá trị:** Tại mỗi tầng phễu, nếu người dùng có phát sinh tương tác thì ghi nhận **1**, nếu không phát sinh thì ghi nhận **0**.
* **Ý nghĩa:** Tỷ lệ giữ chân tầng dưới luôn luôn $\le$ tầng trên, đảm bảo $CR \le 100\%$ trong mọi trường hợp.

```
[ Tầng 1: Vào Trang (100%) ] ─────── PageView
        │
        ▼ (Drop-off 1: Tỷ lệ thoát ngay)
[ Tầng 2: Tương Tác Sản Phẩm ] ──── Xem chi tiết, đổi màu, đổi size, chọn số lượng
        │
        ▼ (Drop-off 2: Rào cản cân nhắc mua hàng)
[ Tầng 3: Thêm Giỏ Hàng ] ───────── Add to Cart
        │
        ▼ (Drop-off 3: Rào cản mở trang thanh toán)
[ Tầng 4: Bắt Đầu Checkout ] ────── Mở form thanh toán, điền địa chỉ
        │
        ▼ (Drop-off 4: Rào cản hoàn tất thanh toán)
[ Tầng 5: Mua Hàng Thành Công ] ─── Purchase (Ghi nhận Doanh thu & AOV)
```

---

### 2. Phương Pháp Chẩn Đoán Điểm Nghẽn Phễu (Bottleneck Diagnosis)
Data Analyst xác định điểm nghẽn bằng công thức tỷ lệ rơi rụng biên giữa hai bước liền kề:

$$\text{Drop-off Rate}_{(k \to k+1)} = \frac{\text{Users}_k - \text{Users}_{k+1}}{\text{Users}_k} \times 100\%$$

* **Nếu rơi rụng lớn nhất ở Tầng 2 ➔ Tầng 3 (Xem SP ➔ Thêm giỏ):**  
  * *Chẩn đoán:* Khách quan tâm mẫu mã nhưng do dự về giá hoặc chưa nhận biết ưu đãi mua nhiều giảm giá.  
  * *Đề xuất Insight:* Làm nổi bật dòng thông báo *"EXTRA 25% OFF FOR NEXT ITEM"* ngay cạnh nút Add to Cart.
* **Nếu rơi rụng lớn nhất ở Tầng 3 ➔ Tầng 4 (Thêm giỏ ➔ Bắt đầu Checkout):**  
  * *Chẩn đoán:* Giỏ hàng chưa đạt ngưỡng $50 để được Free Shipping hoặc khách phân vân về phí ship.  
  * *Đề xuất Insight:* Phân tích xem thanh tiến trình nhắc nhở "Mua thêm 1 chiếc để Free Shipping" có thúc đẩy khách quay lại tăng số lượng không.
* **Nếu rơi rụng lớn nhất ở Tầng 4 ➔ Tầng 5 (Checkout ➔ Mua hàng):**  
  * *Chẩn đoán:* Rào cản phương thức thanh toán, độ dài biểu mẫu hoặc thiếu phương thức thanh toán quen thuộc.  
  * *Đề xuất Insight:* Phân tích tỷ lệ người dùng chọn phương thức thẻ so với PayPal.

---

## IV. CÁC HƯỚNG PHÂN TÍCH PHÂN KHÚC NÂNG CAO (SEGMENTATION & INSIGHTS)

Dữ liệu tracking được tổ chức để Data Analyst có thể trả lời trực tiếp 3 bài toán kinh doanh trọng điểm:

### 1. Phân Tích Hiệu Quả Mua Nhiều Giảm Giá (Buy More Save More / Basket Size Analysis)
* **Câu hỏi phân tích:** *Chính sách giảm thêm 25% cho sản phẩm tiếp theo và Free Ship $50 có thực sự kéo tăng UPT và AOV không?*
* **Chỉ số đo lường:** Tỷ trọng đơn hàng (% share of orders) và Doanh thu trung bình theo quy mô giỏ:
  * Đơn hàng mua 1 chiếc ($31.49 + ship)
  * Đơn hàng mua 2 chiếc (Hưởng giảm 25% chiếc thứ hai + Free Ship)
  * Đơn hàng mua 3+ chiếc
* **Ý nghĩa:** Nếu tỷ lệ đơn hàng mua $\ge 2$ chiếc vượt mốc 45%, chính sách chiết khấu số lượng đang vận hành hiệu quả.

### 2. Phân Tích Độ Nhạy Bén Ưu Đãi Bán Thêm (Upsell Elasticity)
* **Câu hỏi phân tích:** *Ưu đãi nâng cấp chống thấm $9.95 (+30%) giúp tăng trưởng AOV bao nhiêu % so với đơn hàng thuần?*
* **Chỉ số đo lường:**
  * Upsell Take Rate = `upsell_click` / `upsell_impression`.
  * So sánh AOV giữa nhóm có chọn Upsell ($AOV_{\text{with upsell}}$) và nhóm không chọn Upsell ($AOV_{\text{no upsell}}$).

### 3. Phân Tích Hành Vi Chọn Thuộc Tính Sản Phẩm (Variant Preference)
* **Câu hỏi phân tích:** *Màu sắc, kích cỡ và chiều dài ống quần nào được chọn nhiều nhất và có tỷ lệ hoàn tất đơn cao nhất?*
* **Dữ liệu phân tích:** Đối chiếu tương quan giữa các giá trị `color` (Đen, Ghi đá, Xanh navy, Xanh rêu) và `inseam` (Petite, Regular, Tall) với sự kiện `purchase`.
* **Ý nghĩa:** Định hướng kế hoạch nhập hàng, sản xuất và bố trí biến thể mặc định xuất hiện đầu tiên trên Landing Page.

---

## V. QUY TRÌNH KIỂM THỬ & ĐỐI SOÁT DỮ LIỆU DÀNH CHO ANALYST (DATA AUDIT PROTOCOL)

Khi thẩm định dữ liệu thu thập được từ phiên thử nghiệm trên **Live Tracking Inspector**:

1. **Đối soát tính nhất quán của mẫu (Sample Size Audit):**  
   Số lượng User tại mỗi bước phải tuân thủ nghiêm ngặt: $U_{\text{Visit}} \ge U_{\text{Engage}} \ge U_{\text{Cart}} \ge U_{\text{Checkout}} \ge U_{\text{Purchase}}$.
2. **Kiểm tra công thức North Star CR & AOV:**  
   * $CR = \frac{U_{\text{Purchase}}}{U_{\text{Visit}}} \times 100\%$ (Chính xác đến 1 chữ số thập phân).  
   * $AOV = \frac{\text{Doanh thu tổng}}{U_{\text{Purchase}}}$ (Trường hợp chưa có đơn mua, hiển thị về $0.00$).
3. **Đối soát doanh thu từng đơn (Transaction Audit):**  
   Xác minh giá trị `revenue` của mỗi đơn mua hàng bằng đúng:  
   $$\text{Doanh Thu Đơn} = \text{Tiền Quần (Đã Áp Dụng Giảm Giá Số Lượng)} + \text{Giá Trị Ưu Đãi Upsell (nếu có)}$$
4. **Kiểm tra ma trận phân bổ người dùng (User Matrix Audit):**  
   Mỗi khách hàng thử nghiệm chỉ có 1 dòng đại diện duy nhất trên bảng dữ liệu, với các cờ `[1]` hoặc `[0]` thể hiện chính xác điểm dừng cuối cùng của khách hàng.

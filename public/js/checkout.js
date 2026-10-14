/* =========================================================
   GameTech — checkout.js
   صفحه تکمیل سفارش: خلاصه سفارش، اعتبارسنجی فرم و ثبت سفارش
   ---------------------------------------------------------
   ⚠️ پرداخت واقعی پیاده‌سازی نشده است.
   TODO(بک‌اند): ثبت سفارش باید با POST /api/orders انجام شود و
   پرداخت آنلاین به درگاه پرداخت (مثلاً زرین‌پال) منتقل شود.
   فعلاً سفارش به‌صورت نمایشی در localStorage ذخیره می‌شود
   تا صفحه «حساب کاربری» بتواند تاریخچه سفارش را نشان دهد.
   ========================================================= */

const ORDERS_KEY = 'gametech_orders';

/* رندر خلاصه سفارش در ستون کناری */
function renderOrderSummary() {
  const details = getCartDetails();
  const content = document.getElementById('checkout-content');
  const emptyNotice = document.getElementById('checkout-empty');

  // سبد خالی → فرم نمایش داده نمی‌شود
  if (details.items.length === 0) {
    content.hidden = true;
    emptyNotice.hidden = false;
    return;
  }
  content.hidden = false;

  document.getElementById('order-summary').innerHTML = `
    <h2 class="panel-title">سفارش شما</h2>
    <ul class="summary-items">
      ${details.items
        .map(
          ({ product, qty, lineTotal }) => `
        <li>
          <img src="${imageUrl(product.image)}" alt="" />
          <div class="summary-item-info">
            <span>${product.name}</span>
            <span class="cart-item-price">${toFaDigits(qty)} × ${formatPrice(product.price)}</span>
          </div>
          <strong>${formatPrice(lineTotal)}</strong>
        </li>`
        )
        .join('')}
    </ul>
    <ul class="summary-rows" style="margin-top:18px">
      <li><span>تعداد اقلام</span><strong>${toFaDigits(details.count)} عدد</strong></li>
      ${details.discount > 0 ? `<li class="summary-discount"><span>سود شما از خرید</span><strong>${formatPrice(details.discount)}</strong></li>` : ''}
      <li><span>هزینه ارسال</span><strong>پس از ثبت، اعلام می‌شود</strong></li>
    </ul>
    <div class="summary-total"><span>مبلغ قابل پرداخت</span><strong>${formatPrice(details.total)}</strong></div>
    <a class="btn btn-ghost btn-block" href="cart.html">ویرایش سبد خرید</a>`;
}

/* ساخت شیء سفارش، ذخیره نمایشی و نمایش صفحه موفقیت */
function placeOrder(form) {
  const details = getCartDetails();

  const order = {
    code: 'GT-' + Math.floor(100000 + Math.random() * 900000), // کد پیگیری نمایشی
    createdAt: new Date().toISOString(),
    customer: {
      name: form.elements.name.value.trim(),
      phone: toEnDigits(form.elements.phone.value.trim()),
      address: form.elements.address.value.trim(),
      postalCode: toEnDigits(form.elements.postalCode.value.trim()),
    },
    paymentMethod: form.elements.payment.value, // 'online' یا 'cod'
    items: details.items.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
    })),
    total: details.total,
    status: 'pending', // وضعیت اولیه: در حال پردازش
  };

  // ⚠️ فقط برای نسخه نمایشی — TODO(بک‌اند): POST /api/orders
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  clearCart();

  // نمایش صفحه موفقیت
  document.getElementById('checkout-content').hidden = true;
  document.getElementById('checkout-empty').hidden = true;
  const success = document.getElementById('order-success');
  success.hidden = false;
  success.innerHTML = `
    <span class="success-icon">${ICONS.checkCircle}</span>
    <h1>سفارش شما با موفقیت ثبت شد</h1>
    <p>کد پیگیری سفارش: <strong>${toFaDigits(order.code)}</strong></p>
    <p>مبلغ قابل پرداخت: <strong>${formatPrice(order.total)}</strong></p>
    <div class="demo-note" style="margin-top:16px">
      این یک نسخه نمایشی است. در نسخه واقعی، پس از ثبت سفارش به درگاه پرداخت
      منتقل می‌شوید و اطلاعات سفارش در بک‌اند ذخیره می‌شود.
    </div>
    <div class="success-actions">
      <a class="btn btn-primary" href="account.html">پیگیری در حساب کاربری</a>
      <a class="btn btn-outline" href="products.html">ادامه خرید</a>
    </div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  renderOrderSummary();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // اعتبارسنجی فرانت‌اند — TODO(بک‌اند): اعتبارسنجی سمت سرور هم انجام شود
    const checks = [
      [form.elements.name, VALIDATORS.name],
      [form.elements.phone, VALIDATORS.phone],
      [form.elements.address, (v) => (v.trim().length >= 10 ? true : 'آدرس را کامل وارد کنید (حداقل ۱۰ حرف)')],
      [form.elements.postalCode, VALIDATORS.postalCode],
    ];

    let isValid = true;
    for (const [input, validate] of checks) {
      const result = validate(input.value);
      isValid = setFieldError(input, result === true ? '' : result) && isValid;
    }
    if (!isValid) return;

    placeOrder(form);
  });
});

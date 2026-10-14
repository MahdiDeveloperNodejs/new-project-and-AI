/* =========================================================
   GameTech — cart.js
   صفحه سبد خرید: نمایش اقلام، تغییر تعداد، حذف و خلاصه سفارش
   ---------------------------------------------------------
   ذخیره‌سازی و محاسبه‌ها در main.js (بخش سبد خرید) انجام می‌شود؛
   این فایل فقط «نمایش» سبد را مدیریت می‌کند.
   ========================================================= */

/* رندر کامل صفحه سبد بر اساس وضعیت فعلی localStorage */
function renderCartPage() {
  const details = getCartDetails();
  const content = document.getElementById('cart-content');
  const emptyEl = document.getElementById('cart-empty');

  // سبد خالی → نمایش حالت خالی
  if (details.items.length === 0) {
    content.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  content.hidden = false;
  emptyEl.hidden = true;

  // لیست اقلام سبد
  document.getElementById('cart-items').innerHTML = details.items
    .map(({ product, qty, lineTotal }) => {
      const off = discountPercent(product);
      return `
      <div class="cart-item" data-id="${product.id}">
        <a href="${productUrl(product.id)}">
          <img src="${imageUrl(product.image)}" alt="${product.name}" />
        </a>
        <div class="cart-item-info">
          <h3><a href="${productUrl(product.id)}">${product.name}</a></h3>
          <span class="cart-item-price">
            قیمت واحد: ${formatPrice(product.price)}
            ${off ? `<span class="details-discount">٪${toFaDigits(off)}-</span>` : ''}
          </span>
        </div>
        <div class="qty-stepper">
          <button type="button" data-action="inc" aria-label="افزایش تعداد" ${qty >= product.stock ? 'disabled' : ''}>${ICONS.plus}</button>
          <span class="qty-value">${toFaDigits(qty)}</span>
          <button type="button" data-action="dec" aria-label="کاهش تعداد">${ICONS.minus}</button>
        </div>
        <strong class="cart-item-total">${formatPrice(lineTotal)}</strong>
        <button type="button" class="icon-btn cart-remove" data-action="remove" title="حذف از سبد" aria-label="حذف از سبد">
          ${ICONS.trash}
        </button>
      </div>`;
    })
    .join('');

  // خلاصه سفارش
  document.getElementById('cart-summary').innerHTML = `
    <h2 class="panel-title">خلاصه سفارش</h2>
    <ul class="summary-rows">
      <li><span>تعداد اقلام</span><strong>${toFaDigits(details.count)} عدد</strong></li>
      ${details.discount > 0 ? `<li class="summary-discount"><span>سود شما از خرید</span><strong>${formatPrice(details.discount)}</strong></li>` : ''}
    </ul>
    <div class="summary-total"><span>مبلغ قابل پرداخت</span><strong>${formatPrice(details.total)}</strong></div>
    <p class="summary-note">هزینه ارسال در مرحله تکمیل سفارش محاسبه می‌شود.</p>
    <a class="btn btn-primary btn-block btn-lg" href="checkout.html">تکمیل سفارش</a>
    <button type="button" class="btn btn-ghost btn-block" data-action="clear">خالی کردن سبد</button>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  // هر تغییری در سبد (از همین صفحه یا تب دیگر) دوباره رندر می‌کند
  document.addEventListener('cart:change', renderCartPage);

  // دکمه‌های + / − / حذف / خالی کردن سبد
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    // خالی کردن کل سبد
    if (btn.dataset.action === 'clear') {
      clearCart();
      return;
    }

    // تغییر تعداد یا حذف یک قلم
    const itemEl = btn.closest('.cart-item');
    if (!itemEl) return;

    const productId = itemEl.dataset.id;
    const row = getCart().find((i) => i.id === productId);
    const product = getProductById(productId);
    if (!row || !product) return;

    switch (btn.dataset.action) {
      case 'inc':
        if (row.qty < product.stock) setCartQty(productId, row.qty + 1);
        else showToast('بیشتر از موجودی انبار نمی‌توانید افزایش دهید');
        break;
      case 'dec':
        if (row.qty > 1) setCartQty(productId, row.qty - 1);
        else removeFromCart(productId); // تعداد ۱ بود → حذف قلم
        break;
      case 'remove':
        removeFromCart(productId);
        break;
    }
  });
});

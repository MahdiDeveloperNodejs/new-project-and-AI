/* =========================================================
   GameTech — main.js
   کدهای مشترک همه صفحات:
   تنظیمات برند، آیکون‌ها، ابزارهای کمکی، سبد خرید (localStorage)،
   ساخت هدر و فوتر، اعلان‌ها (Toast) و کارت محصول
   ---------------------------------------------------------
   منطق اختصاصی هر صفحه در فایل خودش است:
   products.js، product-details.js، cart.js، checkout.js و auth.js
   ========================================================= */

/* ---------- ۱) تنظیمات برند ----------
   برای تغییر نام یا شعار سایت فقط همین چند خط را عوض کنید. */
const SITE_CONFIG = {
  name: 'GameTech',
  tagline: 'فروشگاه تخصصی تجهیزات گیمینگ و قطعات کامپیوتر',
  freeShippingText: '🚚 ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان',
};

/* مسیر پایه: چون صفحات داخل پوشه pages/ هستند، همه لینک‌ها باید نسبی ساخته شوند
   (صفحه اصلی → '.' و صفحات داخل pages → '..') */
const BASE_URL = window.location.pathname.includes('/pages/') ? '..' : '.';

/* ---------- ۲) آیکون‌های SVG (بدون کتابخانه خارجی) ---------- */
const ICONS = {
  gamepad:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  cart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  star:
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  chevronLeft:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  truck:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  creditCard:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  support:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  mapPin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  twitterX:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="4" x2="19" y2="20"/><line x1="19" y1="4" x2="5" y2="20"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
  checkCircle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertCircle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  logout:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  package:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  filter:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
};

/* ---------- ۳) ابزارهای کمکی ---------- */

// تبدیل ارقام انگلیسی به فارسی (برای درصدها، شماره سفارش و…)
function toFaDigits(value) {
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

// تبدیل ارقام فارسی/عربی به انگلیسی (برای اعتبارسنجی ورودی‌های عددی)
function toEnDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

// قیمت با جداکننده هزارگان فارسی
function formatPrice(amount) {
  return Number(amount).toLocaleString('fa-IR') + ' تومان';
}

// امتیاز فارسی مثل ۴٫۶
function formatRating(rating) {
  return Number(rating).toLocaleString('fa-IR', { maximumFractionDigits: 1 });
}

function imageUrl(fileName) {
  return `${BASE_URL}/assets/images/${fileName}`;
}

function productUrl(productId) {
  return `${BASE_URL}/pages/product-details.html?id=${productId}`;
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

function discountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

// ساخت ستاره‌های امتیاز (پر تا اندازه امتیاز، خالی برای بقیه)
function renderStars(rating) {
  const fullStars = Math.round(rating);
  let html = '<span class="stars" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="${i <= fullStars ? 'is-on' : ''}">${ICONS.star}</i>`;
  }
  return html + '</span>';
}

/* ---------- ۴) اعتبارسنجی مشترک فرم‌ها ----------
   هر اعتبارسنج یا true برمی‌گرداند یا متن خطا.
   خطای هر فیلد زیر همان فیلد (در .field-error) نمایش داده می‌شود. */
const VALIDATORS = {
  required: (v) => (v.trim().length > 0 ? true : 'این فیلد الزامی است'),
  name: (v) => (v.trim().length >= 3 ? true : 'نام باید حداقل ۳ حرف باشد'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? true : 'ایمیل معتبر وارد کنید'),
  phone: (v) => (/^09\d{9}$/.test(toEnDigits(v.trim())) ? true : 'شماره موبایل باید مثل ۰۹۱۲۳۴۵۶۷۸۹ باشد'),
  postalCode: (v) => (/^\d{10}$/.test(toEnDigits(v.trim())) ? true : 'کد پستی باید ۱۰ رقم باشد'),
  password: (v) => (v.length >= 6 ? true : 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
};

// ایمیل یا موبایل بودن ورودی (برای صفحات ورود/ثبت‌نام)
function validateIdentifier(value) {
  const v = value.trim();
  if (!v) return 'این فیلد الزامی است';
  if (VALIDATORS.email(v) === true || VALIDATORS.phone(v) === true) return true;
  return 'ایمیل معتبر یا شماره موبایل (۰۹…) وارد کنید';
}

// نمایش/پاک کردن خطای یک فیلد — true یعنی فیلد مشکلی ندارد
function setFieldError(input, message) {
  const errorEl = input.closest('.form-field')?.querySelector('.field-error');
  input.classList.toggle('is-invalid', Boolean(message));
  if (errorEl) errorEl.textContent = message || '';
  return !message;
}

/* ---------- ۵) اعلان کوتاه (Toast) ---------- */
function showToast(message, options = {}) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const isError = options.type === 'error';
  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' is-error' : ''}`;
  toast.innerHTML = `
    <span class="toast-icon">${isError ? ICONS.alertCircle : ICONS.checkCircle}</span>
    <span class="toast-message">${message}</span>
    ${options.actionText ? `<a class="toast-action" href="${options.actionHref || '#'}">${options.actionText}</a>` : ''}
    <button class="toast-close" type="button" aria-label="بستن">${ICONS.close}</button>`;
  container.appendChild(toast);

  // انیمیشن ورود
  requestAnimationFrame(() => toast.classList.add('is-visible'));

  const close = () => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector('.toast-close').addEventListener('click', close);
  setTimeout(close, 3500);
}

/* ---------- ۶) سبد خرید (ذخیره در localStorage) ----------
   سبد خرید کاملاً سمت مرورگر نگه‌داری می‌شود و در هر آیتم فقط
   «شناسه محصول + تعداد» ذخیره می‌شود تا بعداً اطلاعات به‌روز را
   بتوانید از سرور بگیرید.

   ⚠️ TODO(بک‌اند): سبد سمت سرور (GET/POST /api/cart) هم می‌تواند اضافه شود؛
   فعلاً تنها منبع حقیقت، localStorage است. */
const CART_KEY = 'gametech_cart';

function getCart() {
  try {
    const list = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(list) ? list.filter((i) => i && i.id && i.qty > 0) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
  // صفحه‌هایی که سبد را نمایش می‌دهند به این رویداد گوش می‌دهند
  document.dispatchEvent(new CustomEvent('cart:change'));
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product) return false;

  if (product.stock <= 0) {
    showToast('این محصول فعلاً موجود نیست', { type: 'error' });
    return false;
  }

  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  const newQty = (item ? item.qty : 0) + qty;

  if (newQty > product.stock) {
    showToast(`فقط ${toFaDigits(product.stock)} عدد از این محصول در انبار مانده است`);
    return false;
  }

  if (item) item.qty = newQty;
  else cart.push({ id: productId, qty });

  saveCart(cart);
  showToast('به سبد خرید اضافه شد', {
    actionText: 'مشاهده سبد',
    actionHref: `${BASE_URL}/pages/cart.html`,
  });
  return true;
}

function setCartQty(productId, qty) {
  const product = getProductById(productId);
  const max = product ? product.stock : 1;
  const safeQty = Math.min(Math.max(qty, 1), max);
  const cart = getCart().map((i) => (i.id === productId ? { ...i, qty: safeQty } : i));
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

// ترکیب سبد با اطلاعات محصول + محاسبه مبلغ‌ها
function getCartDetails() {
  const items = [];
  for (const row of getCart()) {
    const product = getProductById(row.id);
    if (!product || product.stock <= 0) continue; // محصول حذف‌شده یا ناموجود نادیده گرفته می‌شود
    items.push({ product, qty: row.qty, lineTotal: product.price * row.qty });
  }
  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.qty * (i.product.oldPrice || i.product.price), 0);
  return {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0),
    total,
    originalTotal,
    discount: originalTotal - total,
  };
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = toFaDigits(count);
  badge.classList.toggle('is-visible', count > 0);
}

/* ---------- ۷) کارت محصول (کامپوننت مشترک) ----------
   در صفحه اصلی، فروشگاه و «محصولات مرتبط» استفاده می‌شود */
function createProductCard(product) {
  const off = discountPercent(product);
  const isOut = product.stock <= 0;
  const category = getCategoryById(product.category);

  return `
  <article class="product-card">
    <a class="product-media" href="${productUrl(product.id)}">
      <img src="${imageUrl(product.image)}" alt="${product.name}" loading="lazy">
      ${off ? `<span class="badge badge-discount">٪${toFaDigits(off)} تخفیف</span>` : ''}
      ${isOut ? '<span class="badge badge-out">ناموجود</span>' : ''}
      ${product.isNew ? '<span class="badge badge-new">جدید</span>' : ''}
    </a>
    <div class="product-body">
      ${category ? `<span class="product-category">${category.name}</span>` : ''}
      <h3 class="product-title"><a href="${productUrl(product.id)}">${product.name}</a></h3>
      <div class="product-rating">
        ${renderStars(product.rating)}
        <span class="rating-num">${formatRating(product.rating)}</span>
        <span class="rating-count">(${toFaDigits(product.ratingCount)})</span>
      </div>
      <div class="product-footer">
        <div class="price-box">
          ${off ? `<del>${formatPrice(product.oldPrice)}</del>` : ''}
          <strong>${formatPrice(product.price)}</strong>
        </div>
        <button class="icon-btn add-to-cart-btn" data-id="${product.id}"
          title="${isOut ? 'ناموجود' : 'افزودن به سبد خرید'}" ${isOut ? 'disabled' : ''}>
          ${ICONS.cart}
        </button>
      </div>
    </div>
  </article>`;
}

/* ---------- ۸) هدر و فوتر (کامپوننت‌های مشترک) ---------- */

function getNavLinksHtml() {
  const links = [
    { href: `${BASE_URL}/index.html`, label: 'صفحه اصلی' },
    { href: `${BASE_URL}/pages/products.html`, label: 'فروشگاه' },
    { href: `${BASE_URL}/pages/about.html`, label: 'درباره ما' },
    { href: `${BASE_URL}/pages/contact.html`, label: 'تماس با ما' },
  ];

  // لینک صفحه جاری برجسته می‌شود
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  return links
    .map((link) => {
      const isActive = currentPage === link.href.split('/').pop() ? 'is-active' : '';
      return `<a class="nav-link ${isActive}" href="${link.href}">${link.label}</a>`;
    })
    .join('');
}

function getHeaderHtml() {
  return `
  <div class="topbar">${SITE_CONFIG.freeShippingText}</div>
  <div class="header-main">
    <div class="container header-inner">
      <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="باز و بسته کردن منو">${ICONS.menu}</button>
      <a class="brand" href="${BASE_URL}/index.html">
        <span class="brand-logo">${ICONS.gamepad}</span>
        <span class="brand-text">${SITE_CONFIG.name}</span>
      </a>
      <nav class="main-nav">${getNavLinksHtml()}</nav>
      <form class="header-search" id="header-search" role="search">
        <input type="search" name="search" placeholder="جستجو در محصولات…" aria-label="جستجو در محصولات">
        <button type="submit" aria-label="جستجو">${ICONS.search}</button>
      </form>
      <div class="header-actions">
        <a class="icon-btn" href="${BASE_URL}/pages/account.html" title="حساب کاربری">${ICONS.user}</a>
        <a class="icon-btn cart-btn" href="${BASE_URL}/pages/cart.html" title="سبد خرید">
          ${ICONS.cart}
          <span class="cart-badge">۰</span>
        </a>
      </div>
    </div>
    <!-- منوی موبایل -->
    <div class="mobile-nav" id="mobile-nav">
      <form class="header-search is-mobile" id="header-search-mobile" role="search">
        <input type="search" name="search" placeholder="جستجو در محصولات…" aria-label="جستجو در محصولات">
        <button type="submit" aria-label="جستجو">${ICONS.search}</button>
      </form>
      <nav class="mobile-links">${getNavLinksHtml()}</nav>
    </div>
  </div>`;
}

function getFooterHtml() {
  const faYear = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });
  const categoryLinks = CATEGORIES.map(
    (c) => `<li><a href="${BASE_URL}/pages/products.html?category=${c.id}">${c.name}</a></li>`
  ).join('');

  return `
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <a class="brand" href="${BASE_URL}/index.html">
        <span class="brand-logo">${ICONS.gamepad}</span>
        <span class="brand-text">${SITE_CONFIG.name}</span>
      </a>
      <p>${SITE_CONFIG.tagline}. این نسخه یک پیش‌نمایش فرانت‌اند است و به‌زودی به بک‌اند متصل می‌شود.</p>
      <div class="social-links">
        <a href="#" title="اینستاگرام" aria-label="اینستاگرام">${ICONS.instagram}</a>
        <a href="#" title="تلگرام" aria-label="تلگرام">${ICONS.telegram}</a>
        <a href="#" title="ایکس" aria-label="ایکس">${ICONS.twitterX}</a>
        <a href="#" title="یوتیوب" aria-label="یوتیوب">${ICONS.youtube}</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>دسترسی سریع</h4>
      <ul>
        <li><a href="${BASE_URL}/index.html">صفحه اصلی</a></li>
        <li><a href="${BASE_URL}/pages/products.html">فروشگاه</a></li>
        <li><a href="${BASE_URL}/pages/cart.html">سبد خرید</a></li>
        <li><a href="${BASE_URL}/pages/account.html">حساب کاربری</a></li>
        <li><a href="${BASE_URL}/pages/about.html">درباره ما</a></li>
        <li><a href="${BASE_URL}/pages/contact.html">تماس با ما</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>دسته‌بندی‌ها</h4>
      <ul>${categoryLinks}</ul>
    </div>
    <div class="footer-col">
      <h4>اطلاعات تماس</h4>
      <ul class="contact-list">
        <li>${ICONS.mapPin}<span>تهران، خیابان ولیعصر، مرکز خرید گیم‌تک، پلاک ۱۲ (نمونه)</span></li>
        <li>${ICONS.phone}<span>۰۲۱-۱۲۳۴۵۶۷۸</span></li>
        <li>${ICONS.mail}<span>info@gametech.ir</span></li>
        <li>${ICONS.clock}<span>شنبه تا پنجشنبه، ۹ تا ۱۸</span></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>© ${faYear} ${SITE_CONFIG.name} — تمامی حقوق محفوظ است.</span>
      <span>ساخته‌شده با HTML، CSS و JavaScript خالص</span>
    </div>
  </div>`;
}

function wireHeaderEvents() {
  const header = document.querySelector('.site-header');

  // باز/بسته کردن منوی موبایل
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    header.classList.toggle('menu-open');
  });

  // جستجوی هدر → صفحه فروشگاه با پارامتر ?search=
  const onSearch = (event) => {
    event.preventDefault();
    const query = event.target.querySelector('input').value.trim();
    window.location.href = `${BASE_URL}/pages/products.html${query ? `?search=${encodeURIComponent(query)}` : ''}`;
  };
  ['header-search', 'header-search-mobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('submit', onSearch);
  });

  // بستن منوی موبایل بعد از کلیک روی هر لینک
  document.querySelectorAll('.mobile-nav a, .mobile-nav button').forEach((el) => {
    el.addEventListener('click', () => header.classList.remove('menu-open'));
  });
}

// دکمه «افزودن به سبد» روی کارت محصولات (یک شنونده برای همه کارت‌ها)
document.addEventListener('click', (event) => {
  const btn = event.target.closest('.add-to-cart-btn');
  if (btn && !btn.disabled) addToCart(btn.dataset.id);
});

// همگام‌سازی شمارنده سبد بین تب‌های باز مرورگر
window.addEventListener('storage', (event) => {
  if (event.key === CART_KEY) updateCartBadge();
});

/* ---------- ۹) بخش‌های داینامیک صفحه اصلی ---------- */
function initHomePage() {
  const fillGrid = (id, list) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = list.map(createProductCard).join('');
  };

  // کارت دسته‌بندی‌ها + تعداد محصول هر دسته
  const categoriesGrid = document.getElementById('categories-grid');
  if (categoriesGrid) {
    categoriesGrid.innerHTML = CATEGORIES.map((cat) => {
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      return `
      <a class="category-card" href="${BASE_URL}/pages/products.html?category=${cat.id}">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
        <span class="category-count">${toFaDigits(count)} محصول</span>
      </a>`;
    }).join('');
  }

  const byNewest = [...PRODUCTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const bySold = [...PRODUCTS].sort((a, b) => b.sold - a.sold);
  const discounted = PRODUCTS.filter((p) => discountPercent(p) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a));

  fillGrid('best-sellers-grid', bySold.slice(0, 4));
  fillGrid('new-arrivals-grid', byNewest.slice(0, 4));
  fillGrid('special-offers-grid', discounted.slice(0, 4));
}

/* ---------- ۱۰) فرم تماس با ما ----------
   فقط اعتبارسنجی فرانت‌اند — ارسال واقعی پیام نیاز به بک‌اند دارد. */
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { name, email, subject, message } = form.elements;

    let isValid = true;
    isValid = setFieldError(name, VALIDATORS.name(name.value)) && isValid;
    isValid = setFieldError(email, VALIDATORS.email(email.value)) && isValid;
    isValid = setFieldError(subject, VALIDATORS.required(subject.value)) && isValid;
    isValid =
      setFieldError(
        message,
        message.value.trim().length >= 10 ? true : 'پیام باید حداقل ۱۰ حرف باشد'
      ) && isValid;
    if (!isValid) return;

    // TODO(بک‌اند): POST /api/contact — در حال حاضر فقط اعلان نمایش داده می‌شود
    showToast('پیام شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.');
    form.reset();
  });
}

/* ---------- ۱۱) راه‌اندازی صفحات ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');

  if (headerEl) {
    headerEl.className = 'site-header';
    headerEl.innerHTML = getHeaderHtml();
    wireHeaderEvents();
  }
  if (footerEl) footerEl.innerHTML = getFooterHtml();

  updateCartBadge();
  initHomePage();
  initContactPage();
});

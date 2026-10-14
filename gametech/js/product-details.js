/* =========================================================
   GameTech — product-details.js
   صفحه جزئیات محصول: گالری، قیمت، موجودی، انتخاب تعداد،
   افزودن به سبد و محصولات مرتبط
   ---------------------------------------------------------
   شناسه محصول از آدرس صفحه خوانده می‌شود: product-details.html?id=p1
   TODO(بک‌اند): به‌جای getProductById از GET /api/products/:id استفاده می‌شود
   ========================================================= */

let selectedQty = 1;

/* رندر کل صفحه بر اساس محصول پیدا شده */
function renderDetailsPage() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const product = getProductById(productId);

  const notFound = document.getElementById('product-not-found');
  const content = document.getElementById('product-page-content');

  if (!product) {
    notFound.hidden = false;
    content.hidden = true;
    document.getElementById('related-products').closest('.section').hidden = true;
    return;
  }

  document.title = `${product.name} | گیم‌تک`;
  renderBreadcrumb(product);
  renderGallery(product);
  renderProductInfo(product);
  renderDescription(product);
  renderSpecs(product);
  renderRelatedProducts(product);
}

/* مسیر راهنما: خانه / فروشگاه / نام دسته / نام محصول */
function renderBreadcrumb(product) {
  const category = getCategoryById(product.category);
  document.getElementById('breadcrumb').innerHTML = `
    <a href="${BASE_URL}/index.html">خانه</a>
    <span class="sep">/</span>
    <a href="${BASE_URL}/pages/products.html">فروشگاه</a>
    <span class="sep">/</span>
    <a href="${BASE_URL}/pages/products.html?category=${product.category}">${category ? category.name : ''}</a>
    <span class="sep">/</span>
    <span class="current">${product.name}</span>`;
}

/* گالری: تصویر بزرگ + تصاویر بندانگشتی قابل کلیک */
function renderGallery(product) {
  const mainImage = document.getElementById('main-image');
  const thumbs = document.getElementById('gallery-thumbs');
  const images = product.images && product.images.length ? product.images : [product.image];

  mainImage.src = imageUrl(images[0]);
  mainImage.alt = product.name;

  thumbs.innerHTML = images
    .map(
      (img, index) => `
      <button type="button" class="${index === 0 ? 'is-active' : ''}" data-src="${imageUrl(img)}" aria-label="تصویر ${toFaDigits(index + 1)}">
        <img src="${imageUrl(img)}" alt="" />
      </button>`
    )
    .join('');

  // کلیک روی تصویر بندانگشتی → تعویض تصویر بزرگ
  thumbs.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    mainImage.src = btn.dataset.src;
    thumbs.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
}

/* ستون اطلاعات: قیمت، موجودی، انتخاب تعداد و دکمه‌های خرید */
function renderProductInfo(product) {
  const category = getCategoryById(product.category);
  const off = discountPercent(product);
  const isOut = product.stock <= 0;
  const isLow = !isOut && product.stock <= 5;

  // متن وضعیت موجودی
  let stockText = 'موجود در انبار';
  let stockClass = '';
  if (isOut) {
    stockText = 'فعلاً ناموجود';
    stockClass = 'is-out';
  } else if (isLow) {
    stockText = `تنها ${toFaDigits(product.stock)} عدد باقی مانده!`;
    stockClass = 'is-low';
  }

  document.getElementById('details-info').innerHTML = `
    <div class="details-info">
      <div class="details-top">
        ${category ? `<span class="product-category">${category.name}</span>` : ''}
        ${product.isNew ? '<span class="badge badge-new" style="position:static">جدید</span>' : ''}
      </div>
      <h1>${product.name}</h1>
      <div class="product-rating">
        ${renderStars(product.rating)}
        <span class="rating-num">${formatRating(product.rating)}</span>
        <span class="rating-count">از ${toFaDigits(product.ratingCount)} نظر — ${toFaDigits(product.sold)} فروش</span>
      </div>
      <p class="details-short">${product.shortDesc}</p>

      <div class="details-price">
        ${off ? `<span class="details-discount">٪${toFaDigits(off)} تخفیف</span><del>${formatPrice(product.oldPrice)}</del>` : ''}
        <strong>${formatPrice(product.price)}</strong>
      </div>

      <div class="details-stock ${stockClass}">
        ${ICONS.package}
        <span>${stockText}</span>
      </div>

      <div class="details-actions">
        <div class="qty-stepper" id="qty-stepper">
          <button type="button" data-step="1" aria-label="افزایش تعداد" ${isOut ? 'disabled' : ''}>${ICONS.plus}</button>
          <span class="qty-value" id="qty-value">${toFaDigits(selectedQty)}</span>
          <button type="button" data-step="-1" aria-label="کاهش تعداد" ${isOut ? 'disabled' : ''}>${ICONS.minus}</button>
        </div>
        <button type="button" id="add-to-cart-main" class="btn btn-primary btn-lg" ${isOut ? 'disabled' : ''}>
          افزودن به سبد خرید
        </button>
        <button type="button" id="buy-now" class="btn btn-outline btn-lg" ${isOut ? 'disabled' : ''}>
          خرید سریع
        </button>
      </div>

      <ul class="details-meta">
        <li><span>کد محصول:</span> ${toFaDigits(product.id.replace('p', ''))}</li>
        <li><span>دسته‌بندی:</span> ${category ? category.name : '—'}</li>
        <li><span>موجودی انبار:</span> ${toFaDigits(product.stock)} عدد</li>
      </ul>
    </div>`;

  // انتخاب تعداد (حداکثر تا موجودی انبار)
  document.getElementById('qty-stepper').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-step]');
    if (!btn || btn.disabled) return;

    const newQty = selectedQty + Number(btn.dataset.step);
    if (newQty < 1) return;
    if (newQty > product.stock) {
      showToast(`حداکثر ${toFaDigits(product.stock)} عدد موجود است`);
      return;
    }
    selectedQty = newQty;
    document.getElementById('qty-value').textContent = toFaDigits(selectedQty);
  });

  // افزودن به سبد
  document.getElementById('add-to-cart-main').addEventListener('click', () => {
    addToCart(product.id, selectedQty);
  });

  // خرید سریع: افزودن به سبد و رفتن به صفحه پرداخت
  document.getElementById('buy-now').addEventListener('click', () => {
    if (addToCart(product.id, selectedQty)) {
      window.location.href = `${BASE_URL}/pages/checkout.html`;
    }
  });
}

/* توضیحات کامل: پاراگراف‌ها با خط خالی از هم جدا می‌شوند */
function renderDescription(product) {
  const container = document.getElementById('product-description');
  container.innerHTML = product.description
    .split('\n\n')
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');
}

/* جدول مشخصات فنی */
function renderSpecs(product) {
  document.getElementById('specs-table').innerHTML = product.specs
    .map((spec) => `<tr><th>${spec.label}</th><td>${spec.value}</td></tr>`)
    .join('');
}

/* محصولات مرتبط: اول از همان دسته، اگر کم بود با پرفروش‌ها کامل می‌شود */
function renderRelatedProducts(product) {
  const container = document.getElementById('related-products');
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const others = PRODUCTS.filter((p) => p.category !== product.category && p.id !== product.id)
    .sort((a, b) => b.sold - a.sold);

  const related = [...sameCategory, ...others].slice(0, 4);
  container.innerHTML = related.map(createProductCard).join('');
}

document.addEventListener('DOMContentLoaded', renderDetailsPage);

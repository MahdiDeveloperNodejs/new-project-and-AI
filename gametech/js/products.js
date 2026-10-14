/* =========================================================
   GameTech — products.js
   صفحه فروشگاه: فیلتر دسته‌بندی، محدوده قیمت، جستجو،
   مرتب‌سازی و دکمه «نمایش بیشتر»
   ---------------------------------------------------------
   TODO(بک‌اند): فعلاً همه فیلترها روی آرایه PRODUCTS انجام می‌شود؛
   بعداً پارامترها به GET /api/products فرستاده می‌شوند.
   ========================================================= */

const PAGE_SIZE = 9; // تعداد محصولی که در هر مرحله نمایش داده می‌شود

// وضعیت فعلی فیلترها — هر تغییری دوباره رندر می‌کند
const shopState = {
  category: 'all',
  search: '',
  minPrice: null,
  maxPrice: null,
  onlyDiscount: false,
  sort: 'newest',
  visibleCount: PAGE_SIZE,
};

/* خواندن فیلترهای اولیه از آدرس صفحه (?category= & ?search= & ?sort=)
   تا لینک‌های «مشاهده همه» و جستجوی هدر کار کنند */
function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const search = params.get('search');
  const sort = params.get('sort');

  if (category && (category === 'all' || getCategoryById(category))) {
    shopState.category = category;
  }
  if (search) shopState.search = search;
  if (['newest', 'bestselling', 'cheapest', 'expensive', 'rating', 'discount'].includes(sort)) {
    shopState.sort = sort;
  }
}

/* اعمال همه فیلترها روی محصولات و مرتب‌سازی نتیجه */
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (shopState.category !== 'all') {
    list = list.filter((p) => p.category === shopState.category);
  }

  if (shopState.search) {
    const query = shopState.search.trim();
    list = list.filter((p) => p.name.includes(query));
  }

  if (shopState.minPrice != null) list = list.filter((p) => p.price >= shopState.minPrice);
  if (shopState.maxPrice != null) list = list.filter((p) => p.price <= shopState.maxPrice);
  if (shopState.onlyDiscount) list = list.filter((p) => discountPercent(p) > 0);

  switch (shopState.sort) {
    case 'cheapest':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'expensive':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'bestselling':
      list.sort((a, b) => b.sold - a.sold);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      list.sort((a, b) => discountPercent(b) - discountPercent(a));
      break;
    default: // newest
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return list;
}

/* ساخت لیست دکمه‌های دسته‌بندی همراه با تعداد محصول هر دسته */
function renderCategoryFilter() {
  const listEl = document.getElementById('filter-categories');
  const counts = {};
  PRODUCTS.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const items = [{ id: 'all', name: 'همه محصولات', icon: '🛒' }, ...CATEGORIES];
  listEl.innerHTML = items
    .map((cat) => {
      const isActive = shopState.category === cat.id ? 'is-active' : '';
      return `
      <li>
        <button type="button" class="filter-cat ${isActive}" data-id="${cat.id}">
          <span>${cat.icon} ${cat.name}</span>
          <span class="filter-count">${toFaDigits(counts[cat.id] || 0)}</span>
        </button>
      </li>`;
    })
    .join('');
}

/* رندر گرید محصولات بر اساس وضعیت فیلترها */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const emptyEl = document.getElementById('shop-empty');
  const loadMoreBtn = document.getElementById('load-more');
  const resultCount = document.getElementById('result-count');

  const all = getFilteredProducts();
  const shown = all.slice(0, shopState.visibleCount);

  grid.innerHTML = shown.map(createProductCard).join('');
  resultCount.textContent = `${toFaDigits(all.length)} محصول پیدا شد`;
  emptyEl.hidden = all.length > 0;
  loadMoreBtn.hidden = shown.length >= all.length;
}

/* فیلترهای انتخاب‌شده را در آدرس صفحه هم نگه می‌داریم تا لینک قابل اشتراک باشد */
function updateUrl() {
  const params = new URLSearchParams();
  if (shopState.category !== 'all') params.set('category', shopState.category);
  if (shopState.search) params.set('search', shopState.search);
  if (shopState.sort !== 'newest') params.set('sort', shopState.sort);
  const query = params.toString();
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
}

/* برگرداندن همه فیلترها به حالت اولیه */
function resetFilters() {
  shopState.category = 'all';
  shopState.search = '';
  shopState.minPrice = null;
  shopState.maxPrice = null;
  shopState.onlyDiscount = false;
  shopState.sort = 'newest';
  shopState.visibleCount = PAGE_SIZE;

  document.getElementById('filter-search').value = '';
  document.getElementById('filter-min').value = '';
  document.getElementById('filter-max').value = '';
  document.getElementById('filter-discount').checked = false;
  document.getElementById('sort-select').value = 'newest';

  renderCategoryFilter();
  renderProducts();
  updateUrl();
}

/* اتصال رویدادها به کنترل‌های فیلتر */
function bindShopControls() {
  // انتخاب دسته‌بندی
  document.getElementById('filter-categories').addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-cat');
    if (!btn) return;
    shopState.category = btn.dataset.id;
    shopState.visibleCount = PAGE_SIZE;
    renderCategoryFilter();
    renderProducts();
    updateUrl();
  });

  // جستجوی زنده روی نام محصول
  const searchInput = document.getElementById('filter-search');
  searchInput.addEventListener('input', () => {
    shopState.search = searchInput.value;
    shopState.visibleCount = PAGE_SIZE;
    renderProducts();
  });

  // فیلتر قیمت
  document.getElementById('apply-price').addEventListener('click', () => {
    const min = parseFloat(toEnDigits(document.getElementById('filter-min').value));
    const max = parseFloat(toEnDigits(document.getElementById('filter-max').value));
    shopState.minPrice = Number.isNaN(min) ? null : min;
    shopState.maxPrice = Number.isNaN(max) ? null : max;
    shopState.visibleCount = PAGE_SIZE;
    renderProducts();
  });

  // فقط تخفیف‌دارها
  document.getElementById('filter-discount').addEventListener('change', (event) => {
    shopState.onlyDiscount = event.target.checked;
    shopState.visibleCount = PAGE_SIZE;
    renderProducts();
  });

  // مرتب‌سازی
  document.getElementById('sort-select').addEventListener('change', (event) => {
    shopState.sort = event.target.value;
    renderProducts();
    updateUrl();
  });

  // نمایش بیشتر
  document.getElementById('load-more').addEventListener('click', () => {
    shopState.visibleCount += PAGE_SIZE;
    renderProducts();
  });

  // حذف فیلترها (دو دکمه داخل پنل و داخل حالت خالی)
  document.getElementById('clear-filters').addEventListener('click', resetFilters);
  document.getElementById('empty-reset').addEventListener('click', resetFilters);

  // باز/بسته کردن پنل فیلترها در موبایل
  document.getElementById('toggle-filters').addEventListener('click', () => {
    document.getElementById('filters-panel').classList.toggle('is-open');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  readFiltersFromUrl();

  // مقدار اولیه کنترل‌ها بر اساس فیلترهای خوانده‌شده از آدرس
  document.getElementById('filter-search').value = shopState.search;
  document.getElementById('sort-select').value = shopState.sort;

  renderCategoryFilter();
  renderProducts();
  bindShopControls();
});

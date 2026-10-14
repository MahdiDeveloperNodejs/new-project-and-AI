/* =========================================================
   GameTech — api.js
   ⚠️ این فایل در حال حاضر «فعال» نیست و توسط هیچ صفحه‌ای لود نمی‌شود.
   فقط نقشه نقطه‌های اتصال به بک‌اند آینده است.

   وقتی بک‌اند Node.js / Express آماده شد:
   ۱) API_BASE را روی آدرس سرور بگذارید.
   ۲) توابع نمونه پایین را کامل کنید (کامنت را بردارید).
   ۳) در صفحات، جای خواندن داده از js/data.js این توابع را صدا بزنید.
   ۴) بعد از جا افتادن کامل، داده‌های نمونه data.js را حذف کنید.

   راهنمای گام‌به‌گام: README.md
   ========================================================= */

/*
const API_BASE = 'http://localhost:3000/api';

// کلید ذخیره توکن JWT بعد از لاگین
const TOKEN_KEY = 'gametech_token';

// یک تابع کمکی ساده برای همه درخواست‌ها
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `خطای سرور: ${response.status}`);
  }
  return response.json();
}

// ---------------- نمونه توابع آینده ----------------

// محصولات (به‌جای آرایه PRODUCTS در data.js)
// async function fetchProducts({ search, category, minPrice, maxPrice, sort, page }) {
//   const query = new URLSearchParams({ search, category, minPrice, maxPrice, sort, page });
//   return apiRequest(`/products?${query}`);
// }

// یک محصول (به‌جای getProductById)
// async function fetchProduct(id) {
//   return apiRequest(`/products/${id}`);
// }

// دسته‌بندی‌ها (به‌جای CATEGORIES)
// async function fetchCategories() {
//   return apiRequest('/categories');
// }

// احراز هویت
// async function registerUser(body) {
//   return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) });
// }
// async function loginUser(identifier, password) {
//   const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
//   localStorage.setItem(TOKEN_KEY, data.token);
//   return data.user;
// }
// async function fetchCurrentUser() {
//   return apiRequest('/auth/me');
// }

// سفارش‌ها (به‌جای ذخیره در localStorage در checkout.js)
// async function submitOrder(order) {
//   return apiRequest('/orders', { method: 'POST', body: JSON.stringify(order) });
// }
// async function fetchMyOrders() {
//   return apiRequest('/orders');
// }

// درگاه پرداخت — TODO: بسته به درگاهی که انتخاب می‌کنید (زرین‌پال، آیدی‌پی و…)
// async function requestPayment(orderId) {
//   return apiRequest('/payment/request', { method: 'POST', body: JSON.stringify({ orderId }) });
// }
*/

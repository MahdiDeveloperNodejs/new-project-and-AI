# GameTech 🎮 — فروشگاه گیمینگ و قطعات کامپیوتر

A complete, beginner-friendly **frontend** for a Persian (RTL) gaming & PC-hardware e-commerce store, built with **HTML, CSS, and vanilla JavaScript** — no frameworks, no build step.

> This project intentionally contains **no backend**. All data is placeholder data, the cart uses `localStorage`, and auth is a UI demo. Everything is organized so you can plug in your own Node.js/Express backend later — see the [Backend Integration](#backend-integration-اتصال-به-بکاند) section.

---

## 1. Running the project

**Option A — just open it (simplest):**

1. Open the `gametech` folder.
2. Double-click `index.html`. Done.

**Option B — local server (recommended, closer to real hosting):**

```bash
# from inside the gametech folder — pick any ONE of these:
python -m http.server 8000
npx serve .
```

Then open `http://localhost:8000`.

No `npm install` is required — the only external resource is the **Vazirmatn** font, loaded from Google Fonts (with a Tahoma fallback, so the site still works offline).

---

## 2. Folder structure

```text
gametech/
├── index.html                  ← صفحه اصلی (hero، دسته‌بندی‌ها، پرفروش‌ها، جدیدترین‌ها، تخفیف‌ها)
├── pages/
│   ├── products.html           ← فروشگاه (فیلتر، جستجو، مرتب‌سازی، نمایش بیشتر)
│   ├── product-details.html    ← جزئیات محصول (گالری، مشخصات، محصولات مرتبط)
│   ├── cart.html               ← سبد خرید
│   ├── checkout.html           ← تکمیل سفارش (فرم + خلاصه سفارش)
│   ├── login.html              ← ورود (نمایشی)
│   ├── register.html           ← ثبت‌نام (نمایشی)
│   ├── forgot-password.html    ← فراموشی رمز (نمایشی)
│   ├── account.html            ← حساب کاربری (پروفایل، سفارش‌ها، خروج)
│   ├── about.html              ← درباره ما
│   └── contact.html            ← تماس با ما
├── css/
│   └── style.css               ← کل طراحی (متغیرها، کامپوننت‌ها، ریسپانسیو)
├── js/
│   ├── data.js                 ← ⚠️ داده‌های نمونه محصولات/دسته‌بندی‌ها (جایگزین API)
│   ├── main.js                 ← کد مشترک: هدر/فوتر، آیکون‌ها، سبد خرید، Toast، اعتبارسنجی
│   ├── products.js             ← منطق صفحه فروشگاه
│   ├── product-details.js      ← منطق صفحه جزئیات
│   ├── cart.js                 ← منطق صفحه سبد خرید
│   ├── checkout.js             ← منطق صفحه تکمیل سفارش
│   ├── auth.js                 ← منطق ورود/ثبت‌نام/فراموشی رمز/حساب کاربری
│   └── api.js                  ← 🔌 نقطه‌های اتصال به بک‌اند (فعلاً کامنت‌شده)
├── assets/
│   └── images/                 ← تصاویر SVG محصولات، هیرو و فاوآیکون
└── README.md
```

## 3. What works right now (frontend-only)

| Feature | Status |
| --- | --- |
| Navigation between all pages, responsive mobile menu | ✅ works |
| Product search (header + shop page), category & price filters, discount-only filter | ✅ works |
| Sorting (newest / bestselling / cheapest / most expensive / rating / discount) | ✅ works |
| Load-more pagination on the shop page | ✅ works |
| Add to cart, change quantity, remove items — persisted in `localStorage` | ✅ works |
| Cart totals, discount savings, empty-cart state | ✅ works |
| Checkout form validation (name, Iranian mobile `09…`, address, 10-digit postal code) | ✅ works |
| Demo order placed → visible in account page order history | ✅ works (local demo) |
| Login / register / forgot password / account — UI + validation | ✅ works (demo only, **no passwords stored**) |
| Contact form validation | ✅ works (message is not actually sent) |
| Real payments, real products, real auth | ❌ needs your backend |

`localStorage` keys used: `gametech_cart`, `gametech_session`, `gametech_users`, `gametech_orders`.
All are demo keys — delete them from DevTools → Application → Local Storage to reset.

## 4. Changing the branding

Everything brand-related lives in **one place**: the `SITE_CONFIG` object at the top of `js/main.js` (name, tagline, free-shipping banner). The logo mark is plain HTML/CSS in `getHeaderHtml()` in the same file, and the favicon is `assets/images/favicon.svg`.

## 5. Adding real products

Edit `js/data.js`. Each product is a plain object:

```js
{
  id: 'p1',              // unique id (later: database id)
  name: 'ماوس گیمینگ فانتوم X7',
  category: 'mouse',     // one of the ids in CATEGORIES
  price: 2150000,        // current price (Toman)
  oldPrice: 2690000,     // pre-discount price, or null
  rating: 4.6,
  ratingCount: 312,
  sold: 1250,            // for the "bestsellers" section
  stock: 14,             // 0 = out of stock
  createdAt: '2026-08-12',
  isNew: true,
  image: 'mouse-1.svg',  // file inside assets/images/
  images: ['mouse-1.svg', 'mouse-2.svg'],
  shortDesc: '…',
  description: 'پاراگراف اول\n\nپاراگراف دوم',
  specs: [{ label: 'سنسور', value: 'اپتیکال ۲۶٬۰۰۰ DPI' }],
}
```

## 6. Backend integration (اتصال به بک‌اند)

### 6.1 API endpoints you'll most likely need

| Method | Endpoint | Used by |
| --- | --- | --- |
| GET | `/api/products` (`?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=`) | shop page |
| GET | `/api/products/:id` | product details |
| GET | `/api/products/best-sellers`, `/new-arrivals`, `/on-sale` *(or query flags)* | home page |
| GET | `/api/categories` | home + footer + shop filters |
| POST | `/api/auth/register` | register page |
| POST | `/api/auth/login` (returns JWT) | login page |
| POST | `/api/auth/logout` | account page |
| GET | `/api/auth/me` | account page |
| POST | `/api/auth/forgot-password` | forgot-password page |
| PATCH | `/api/users/me` | account → edit profile |
| POST | `/api/orders` | checkout (create order) |
| GET | `/api/orders` (current user's) | account → order history |
| GET | `/api/orders/:id` | order tracking |
| POST | `/api/payment/request` + `GET /api/payment/verify` | online payment (e.g. ZarinPal) |
| POST | `/api/contact` | contact form |

### 6.2 Step-by-step connection guide

1. **Serve the frontend from Express** (no CORS pain, one origin):

   ```js
   // server.js
   const express = require('express');
   const path = require('path');
   const app = express();

   app.use(express.json());
   app.use(express.static(path.join(__dirname)));      // serves gametech/
   app.use('/api', require('./routes/api'));            // your API routes

   app.listen(3000, () => console.log('http://localhost:3000'));
   ```

   `index.html` and `pages/…` load automatically; `js/api.js` is where fetch calls go.

2. **Replace the placeholder data.** In `js/products.js` the function `getFilteredProducts()` filters `PRODUCTS` locally — replace its body with a call like:

   ```js
   const { apiRequest } = window.GameTechAPI; // functions you un-comment in js/api.js
   const { products } = await apiRequest(`/products?${new URLSearchParams(shopState)}`);
   ```

   Same idea for `getProductById` (details page) and the home-page grids in `main.js → initHomePage()`.
   Every spot that needs your API is already marked with a `TODO(بک‌اند)` comment.

3. **Auth.** Un-comment `loginUser()` in `js/api.js`. On success it stores the JWT in `localStorage` (`gametech_token`) and sends it as an `Authorization: Bearer …` header on every request. Then swap the demo session logic in `js/auth.js` for calls to `/api/auth/*`. **Keep it that way — passwords must never be stored client-side.**

4. **Cart.** The cart currently lives in `localStorage` as `[{ id, qty }]` — keep this even after launch (it works offline and reduces server calls); only call `POST /api/orders` at checkout with `getCartDetails()` as the payload.

5. **Payments.** In `checkout.js → placeOrder()`, after `POST /api/orders` succeeds, redirect the user to the payment URL your backend returns (e.g. ZarinPal). The payment-gateway callback URL should point to your Express route, which verifies the payment and updates the order status.

---

Made with plain HTML, CSS, and JavaScript — built to learn from, easy to extend. 🎮

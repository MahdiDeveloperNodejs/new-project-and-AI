/* =========================================================
   GameTech — auth.js
   منطق صفحات: ورود، ثبت‌نام، فراموشی رمز و حساب کاربری
   ---------------------------------------------------------
   ⚠️ نکته امنیتی مهم:
   هیچ رمز عبوری در localStorage ذخیره نمی‌شود!
   این بخش فقط برای نمایش رفتار رابط کاربری است؛ احراز هویت واقعی
   باید در بک‌اند (Node.js + Express + توکن JWT) انجام شود.

   کلیدهای localStorage:
     gametech_session → اطلاعات ورود فعلی (فقط نام و ایمیل/موبایل)
     gametech_users   → پروفایل‌های نمایشی (بدون رمز عبور)
     gametech_orders  → سفارش‌های نمایشی (توسط checkout.js ساخته می‌شود)
   ========================================================= */

const SESSION_KEY = 'gametech_session';
const USERS_KEY = 'gametech_users';

// برچسب و رنگ وضعیت‌های سفارش
const ORDER_STATUS = {
  pending:   { label: 'در حال پردازش', class: 'st-pending' },
  shipped:   { label: 'ارسال شده',     class: 'st-shipped' },
  delivered: { label: 'تحویل شده',     class: 'st-delivered' },
  canceled:  { label: 'لغو شده',       class: 'st-canceled' },
};

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---------- صفحه ورود ---------- */
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // اگر قبلاً وارد شده، مستقیم به حساب کاربری برو
  if (getSession()) {
    window.location.href = 'account.html';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const identifier = form.elements.identifier;
    const password = form.elements.password;

    const idOk = setFieldError(identifier, validateIdentifier(identifier.value));
    const passOk = setFieldError(password, VALIDATORS.password(password.value));
    if (!idOk || !passOk) return;

    // ⚠️ نسخه نمایشی: هر ایمیل/موبایل معتبر پذیرفته می‌شود.
    // TODO(بک‌اند): POST /api/auth/login — بررسی رمز در سرور و دریافت توکن JWT
    const contact = identifier.value.trim();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const knownUser = users.find((u) => u.contact === contact);

    setSession({ name: knownUser ? knownUser.name : contact, contact });
    showToast('خوش آمدید! ورود با موفقیت انجام شد.');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 700);
  });
}

/* ---------- صفحه ثبت‌نام ---------- */
function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  if (getSession()) {
    window.location.href = 'account.html';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const identifier = form.elements.identifier;
    const password = form.elements.password;
    const confirm = form.elements.confirmPassword;

    let isValid = true;
    isValid = setFieldError(name, VALIDATORS.name(name.value)) && isValid;
    isValid = setFieldError(identifier, validateIdentifier(identifier.value)) && isValid;
    isValid = setFieldError(password, VALIDATORS.password(password.value)) && isValid;
    isValid =
      setFieldError(
        confirm,
        password.value === confirm.value && confirm.value ? true : 'تکرار رمز عبور با رمز عبور یکسان نیست'
      ) && isValid;
    if (!isValid) return;

    // ذخیره پروفایل نمایشی — «رمز عبور ذخیره نمی‌شود»
    // TODO(بک‌اند): POST /api/auth/register
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const contact = identifier.value.trim();
    if (!users.some((u) => u.contact === contact)) {
      users.push({
        name: name.value.trim(),
        contact,
        joinedAt: new Date().toISOString(),
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    setSession({ name: name.value.trim(), contact });
    showToast('ثبت‌نام با موفقیت انجام شد. خوش آمدید!');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 700);
  });
}

/* ---------- صفحه فراموشی رمز ---------- */
function initForgotPage() {
  const form = document.getElementById('forgot-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const identifier = form.elements.identifier;
    if (!setFieldError(identifier, validateIdentifier(identifier.value))) return;

    // TODO(بک‌اند): POST /api/auth/forgot-password — ارسال لینک/کد بازیابی
    const notice = document.getElementById('forgot-notice');
    notice.hidden = false;
    notice.textContent =
      'درخواست شما ثبت شد. اگر این ایمیل/شماره در سیستم موجود باشد، لینک بازیابی ارسال می‌شود. (این پیام در حالت نمایشی ثابت است)';
    showToast('درخواست بازیابی رمز ثبت شد');
    form.reset();
  });
}

/* ---------- صفحه حساب کاربری ---------- */
function renderOrderHistory() {
  const listEl = document.getElementById('orders-list');
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('gametech_orders') || '[]');
  } catch {
    orders = [];
  }
  orders.reverse(); // جدیدترین سفارش بالا

  if (orders.length === 0) {
    listEl.innerHTML = `
      <div class="mini-empty">
        <p>هنوز سفارشی ثبت نکرده‌اید.</p>
        <a class="btn btn-outline" href="products.html">شروع خرید</a>
      </div>`;
    return;
  }

  listEl.innerHTML = orders
    .map((order) => {
      const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
      const date = new Date(order.createdAt).toLocaleDateString('fa-IR');
      const itemsCount = order.items.reduce((sum, i) => sum + i.qty, 0);
      return `
      <div class="order-card">
        <div class="order-head">
          <span class="order-code">سفارش ${toFaDigits(order.code)}</span>
          <span class="order-status ${status.class}">${status.label}</span>
        </div>
        <div class="order-items">
          ${order.items.map((item) => `<span class="order-item">${item.name}</span>`).join('')}
        </div>
        <div class="order-foot">
          <span class="cart-item-price">${date} — ${toFaDigits(itemsCount)} قلم کالا</span>
          <strong>${formatPrice(order.total)}</strong>
        </div>
      </div>`;
    })
    .join('');
}

function initAccountPage() {
  const guestEl = document.getElementById('account-guest');
  const contentEl = document.getElementById('account-content');
  if (!guestEl || !contentEl) return;

  const session = getSession();

  // وارد نشده → فقط پیام «وارد شوید»
  if (!session) {
    guestEl.hidden = false;
    contentEl.hidden = true;
    return;
  }
  guestEl.hidden = true;
  contentEl.hidden = false;

  // نمایش اطلاعات پایه
  document.getElementById('account-name').textContent = session.name;
  document.getElementById('account-contact').textContent = session.contact;
  document.getElementById('account-avatar').textContent = (session.name || 'گ').trim().charAt(0);

  // فرم ویرایش پروفایل
  const profileForm = document.getElementById('profile-form');
  profileForm.elements.name.value = session.name;
  profileForm.elements.contact.value = session.contact;

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = profileForm.elements.name;
    const contact = profileForm.elements.contact;

    let isValid = true;
    isValid = setFieldError(name, VALIDATORS.name(name.value)) && isValid;
    isValid = setFieldError(contact, validateIdentifier(contact.value)) && isValid;
    if (!isValid) return;

    // TODO(بک‌اند): PATCH /api/users/me
    const updated = { name: name.value.trim(), contact: contact.trim() };
    setSession(updated);

    // اگر کاربر در لیست نمایشی بود، همان‌جا هم به‌روز شود
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u) => u.contact === session.contact);
    if (index >= 0) {
      users[index] = { ...users[index], ...updated };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    showToast('پروفایل با موفقیت به‌روزرسانی شد');
    document.getElementById('account-name').textContent = updated.name;
    document.getElementById('account-contact').textContent = updated.contact;
    document.getElementById('account-avatar').textContent = updated.name.charAt(0);
  });

  // تاریخچه سفارش‌ها
  renderOrderHistory();

  // خروج از حساب
  document.getElementById('logout-btn').addEventListener('click', () => {
    // TODO(بک‌اند): POST /api/auth/logout — ابطال توکن سمت سرور
    clearSession();
    showToast('از حساب خود خارج شدید');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 600);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initRegisterPage();
  initForgotPage();
  initAccountPage();
});

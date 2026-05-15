(function () {
  const root = document.documentElement;
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const form = document.querySelector("[data-demo-form]");
  const toast = document.querySelector("[data-toast]");
  const header = document.querySelector("[data-header]");

  const storageKey = "student-learning-hub-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.textContent = "浅色模式";
      }
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.textContent = "深色模式";
      }
    }
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const stored = getStoredTheme();
  applyTheme(stored === "dark" || stored === "light" ? stored : prefersDark.matches ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* ignore */
    }
  });

  prefersDark.addEventListener("change", (e) => {
    if (getStoredTheme()) return;
    applyTheme(e.matches ? "dark" : "light");
  });

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      const y = window.scrollY;
      header.style.boxShadow =
        y > 8 ? "0 12px 30px rgba(15, 23, 42, 0.06)" : "none";
    },
    { passive: true }
  );

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    if (!email) return;
    if (toast) {
      toast.textContent = `已记录演示提交：${email}（未连接服务器）`;
    }
    form.reset();
  });
})();

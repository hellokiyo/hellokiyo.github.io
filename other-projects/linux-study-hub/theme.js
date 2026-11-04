(() => {
  const storageKey = 'linux-study-theme';
  const saved = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = saved ? saved === 'dark' : prefersDark;

  document.documentElement.classList.toggle('dark-mode', startDark);

  function syncButton(button) {
    const isDark = document.documentElement.classList.contains('dark-mode');
    button.textContent = isDark ? '라이트모드' : '다크모드';
    button.setAttribute('aria-pressed', String(isDark));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.theme-toggle')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', '화면 테마 바꾸기');
    syncButton(button);

    button.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
      syncButton(button);
    });

    nav.appendChild(button);
  });
})();

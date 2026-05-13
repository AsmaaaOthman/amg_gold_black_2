(function() {
  "use strict";

  const THEME_KEY = 'amg-theme-preference';
  const DARK_MODE_CLASS = 'dark-background';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    let prefersDark = false;
    if (!savedTheme) {
      prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      prefersDark = savedTheme === 'dark';
    }
    applyTheme(prefersDark);
    updateThemeToggleButton(prefersDark);
  }

  function applyTheme(isDark) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    if (isDark) {
      htmlElement.classList.add(DARK_MODE_CLASS);
      bodyElement.classList.add(DARK_MODE_CLASS);
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      htmlElement.classList.remove(DARK_MODE_CLASS);
      bodyElement.classList.remove(DARK_MODE_CLASS);
      localStorage.setItem(THEME_KEY, 'light');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains(DARK_MODE_CLASS);
    applyTheme(!isDark);
    updateThemeToggleButton(!isDark);
  }

  function updateThemeToggleButton(isDark) {
    // Update sidebar toggle button
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      const label = toggleBtn.querySelector('.theme-label');
      if (isDark) {
        toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        if (icon) { icon.classList.remove('bi-moon-stars-fill'); icon.classList.add('bi-sun-fill'); }
        if (label) label.textContent = 'Light Mode';
      } else {
        toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        if (icon) { icon.classList.remove('bi-sun-fill'); icon.classList.add('bi-moon-stars-fill'); }
        if (label) label.textContent = 'Dark Mode';
      }
    }
  }

  function createThemeToggleButton() {
    // Only inject into sidebar footer - NOT the navbar
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (!sidebarFooter) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.className = 'sidebar-theme-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');

    const icon = document.createElement('i');
    icon.className = 'bi bi-moon-stars-fill';

    const label = document.createElement('span');
    label.className = 'theme-label';
    label.textContent = 'Dark Mode';

    toggleBtn.appendChild(icon);
    toggleBtn.appendChild(label);
    toggleBtn.addEventListener('click', toggleTheme);

    sidebarFooter.appendChild(toggleBtn);
  }

  function listenForSystemThemeChange() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches);
          updateThemeToggleButton(e.matches);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createThemeToggleButton();
      initTheme();
      listenForSystemThemeChange();
    });
  } else {
    createThemeToggleButton();
    initTheme();
    listenForSystemThemeChange();
  }

})();

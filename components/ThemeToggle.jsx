'use client';

import { useEffect, useState } from 'react';

function applyTheme(value) {
  if (value === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', value);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState('auto');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'auto');
  }, []);

  function handleChange(value) {
    setTheme(value);
    localStorage.setItem('theme', value);
    applyTheme(value);
  }

  return (
    <div className="theme-toggle" role="group" aria-label="تبديل المظهر">
      <button
        type="button"
        aria-label="المظهر الفاتح"
        data-active={theme === 'light'}
        onClick={() => handleChange('light')}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-label="المظهر الداكن"
        data-active={theme === 'dark'}
        onClick={() => handleChange('dark')}
      >
        <MoonIcon />
      </button>
      <button
        type="button"
        aria-label="حسب النظام"
        data-active={theme === 'auto'}
        onClick={() => handleChange('auto')}
      >
        <AutoIcon />
      </button>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 20h8M12 17v3" />
    </svg>
  );
}

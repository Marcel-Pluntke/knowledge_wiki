import {useEffect} from 'react';

const footballMenuMarkup = `
  <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="8"/>
    <path d="m9.5 9 2.5-2 2.5 2-.9 3H10.4L9.5 9ZM12 4v3M5.7 7.4l3.8 1.6M18.3 7.4 14.5 9M6.2 16.8l4.2-4.8M17.8 16.8 13.6 12M9.2 19.5l1.2-4.5M14.8 19.5 13.6 15"/>
  </svg>
  <span>Mathe Fußball</span>
`;

export function FootballMenuEnhancer() {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!location.hash && params.get('mode') === 'football') {
      location.hash = '/football';
    }

    const sync = () => {
      const sheet = document.querySelector<HTMLElement>('.nav-sheet');
      if (!sheet || sheet.querySelector('[data-football-menu]')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.footballMenu = 'true';
      button.innerHTML = footballMenuMarkup;
      button.addEventListener('click', () => {
        location.hash = '/football';
      });

      const logout = sheet.querySelector('.logout-action');
      sheet.insertBefore(button, logout);
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {childList: true, subtree: true});
    sync();
    return () => observer.disconnect();
  }, []);

  return null;
}

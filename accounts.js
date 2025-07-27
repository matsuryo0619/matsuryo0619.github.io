window.addEventListener('headerSearchCreated', () => {
  import { accounts_parent } from './header.js';
  if (!localStorage.getItem('account')) {
    accounts_parent.style.display = 'none';
});

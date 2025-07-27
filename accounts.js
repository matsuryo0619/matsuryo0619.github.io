import { accounts_parent } from './header.js';

window.addEventListener('headerSearchCreated', () => {
  if (!localStorage.getItem('account')) {
    accounts_parent.style.display = 'none';
  }
  console.log(accounts_parent);
});

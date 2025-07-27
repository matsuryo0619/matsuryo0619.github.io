window.addEventListener('headerSearchCreated', async () => {
  const { accounts_parent } = await import('./header.js');
  const Make_accounts = document.getElementById('header_Toaccounts');
  if (!localStorage.getItem('account')) {
    accounts_parent.style.display = 'none';
  }
  console.log(accounts_parent);
});

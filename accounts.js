window.addEventListener('headerSearchCreated', async () => {
  const { accounts_parent } = await import('./header.js');
  const Make_accounts = document.getElementById('header_Toaccounts');
  const login = document.getElementById('header_Tologin');
  const urlParams = new URLSearchParams(window.location.search);
  if (!localStorage.getItem('account')) {
    accounts_parent.style.display = 'none';
    if (window.location.origin + window.location.pathname === 'https://matsuryo0619.github.io/scratchblog/accounts.html') {
      if (urlParams.get('type') === 'make') {
        document.title = 'アカウントを作成 - スゴスク!';
        
        const form = document.createElement('form');
        form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSczgHouSE1zLsfoT7M7O9p3iReQt1p9t3tlXIoxBMqShvrz1g/formResponse';
        form.method = 'post';
        form.id = 'accounts_form';

        const AccountName_P = document.createElement('p');
        const AccountName = document.createElement('input');
        AccountName.type = 'text';
        AccountName.autocomplete = 'username';
        AccountName.name = 'entry.1357779689';
        AccountName.placeholder = 'アカウント名';
        AccountName.required = true;
        AccountName.id = 'Account_Name';
        AccountName_P.appendChild(AccountName);
        form.appendChild(AccountName_P);
        AccountName.addEventListener('focus', function() {
          this.select();
        });

        const AccountPass_P = document.createElement('p');
        const AccountPass = document.createElement('input');
        AccountPass.type = 'password';
        AccountPass.autocomplete = 'new-password';
        AccountPass.name = 'entry.1714274511';
        AccountPass.placeholder = 'Password';
        AccountPass.required = true;
        AccountPass.id = 'Accounts_wcheck';
        AccountPass_P.appendChild(AccountPass);
        form.appendChild(AccountPass_P);

        const Submit = document.createElement('input');
        Submit.type = "submit";
        Submit.id = "submitbutton";
        Submit.value = "登録";
        form.appendChild(Submit);

        document.body.appendChild(form);
      } else if (urlParams.get('type') === 'login') {
        document.title = 'ログイン - スゴスク!';
      }
    }
  } else {
    Make_accounts.style.display = 'none';
    login.style.display = 'none';
    accounts_parent.querySelector('p').textContent = localStorage.getItem('account');
    if (window.location.origin + window.location.pathname === 'https://matsuryo0619.github.io/scratchblog/accounts.html') {
      document.title = 'アカウント設定 - スゴスク!';
    }
  }
});

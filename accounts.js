window.addEventListener('headerSearchCreated', async () => {
  const { accounts_parent } = await import('./header.js');
  const Make_accounts = document.getElementById('header_Toaccounts');
  const login = document.getElementById('header_Tologin');
  const urlParams = new URLSearchParams(window.location.search);

  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1E0MjL8CXf-_pF3Lf1K1-w0pMx3EEaLO_zimIPpIkkPk/export?format=csv&range=A1:D';

  if (!localStorage.getItem('account')) {
    accounts_parent.style.display = 'none';
    if (window.location.origin + window.location.pathname === 'https://matsuryo0619.github.io/scratchblog/accounts.html') {
      if (urlParams.get('type') === 'make') {
        document.title = 'アカウントを作成 - スゴスク!';

        const form = document.createElement('form');
        form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSczgHouSE1zLsfoT7M7O9p3iReQt1p9t3tlXIoxBMqShvrz1g/formResponse';
        form.method = 'post';
        form.id = 'accounts_form';
        form.target = 'hidden_iframe';

        const saltInput = document.createElement('input');
        saltInput.type = 'hidden';
        saltInput.name = 'entry.155315392';
        form.appendChild(saltInput);

        const hashedPasswordInput = document.createElement('input');
        hashedPasswordInput.type = 'hidden';
        hashedPasswordInput.name = 'entry.1949907076';
        form.appendChild(hashedPasswordInput);

        async function checkDuplicateAccount(username) {
          try {
            const timestamp = new Date().getTime();
            const csvUrl = `${GOOGLE_SHEET_CSV_URL}&_t=${timestamp}`;
            const existingAccounts = await d3.csv(csvUrl);

            const possibleAccountNameColumns = [
              'アカウント名', 'ユーザー名', 'Account Name', 'Username'
            ];

            let accountNameColumn = null;
            let isDuplicate = false;

            if (existingAccounts.length > 0) {
              const availableColumns = Object.keys(existingAccounts[0]);
              accountNameColumn = possibleAccountNameColumns.find(col => availableColumns.includes(col));
              if (!accountNameColumn && availableColumns.length >= 2) {
                accountNameColumn = availableColumns[1];
              }

              if (accountNameColumn) {
                isDuplicate = existingAccounts.some(row => {
                  const existingUsername = row[accountNameColumn];
                  return existingUsername && existingUsername.toString().trim().toLowerCase() === username.trim().toLowerCase();
                });
              }
            }
            return isDuplicate;
          } catch (error) {
            console.error('重複チェックエラー:', error);
            throw new Error('アカウント名の重複チェックに失敗しました。しばらく待ってから再試行してください。');
          }
        }

        form.onsubmit = async function(event) {
          event.preventDefault();

          const AccountNameInput = document.getElementById('Account_Name');
          const AccountPassInput = document.getElementById('Accounts_wcheck');
          const password = AccountPassInput.value;
          const username = AccountNameInput.value;

          if (!password || !username) {
            alert('アカウント名とパスワードを両方入力してください！');
            return false;
          }

          if (username.length < 3 || username.length > 20) {
            alert('アカウント名は3文字以上20文字以下で入力してください！');
            return false;
          }

          if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            alert('アカウント名は英数字とアンダースコア(_)のみ使用できます！');
            return false;
          }

          const submitButton = document.getElementById("submitbutton");
          submitButton.disabled = true;
          submitButton.value = "確認中...";

          try {
            const isDuplicate = await checkDuplicateAccount(username);
            if (isDuplicate) {
              alert('そのアカウント名はすでに使われています。別のアカウント名を入力してください！');
              submitButton.disabled = false;
              submitButton.value = "登録";
              return false;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            const isDuplicateSecond = await checkDuplicateAccount(username);
            if (isDuplicateSecond) {
              alert('そのアカウント名はすでに使われています。別のアカウント名を入力してください！');
              submitButton.disabled = false;
              submitButton.value = "登録";
              return false;
            }

            submitButton.value = "登録中...";

            const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
            const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            saltInput.value = salt;

            const combined = password + salt;
            const encoder = new TextEncoder();
            const dataToHash = encoder.encode(combined);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            hashedPasswordInput.value = hashedPassword;
            AccountPassInput.value = '';

            document.getElementById('hidden_iframe').onload = function() {
              alert('アカウントの登録が完了しました！');
              submitButton.disabled = false;
              submitButton.value = "登録";
              form.reset();

              localStorage.setItem('account', username);
              const sessionToken = secureAuth.generateSessionToken();
              secureAuth.setAuthData(username, sessionToken);

              window.location.replace('https://matsuryo0619.github.io/scratchblog/Home.html');
            };

            form.submit();

          } catch (error) {
            console.error('登録処理エラー:', error);
            alert(error.message || '処理中にエラーが発生しました。もう一度試してみてください！');
            submitButton.disabled = false;
            submitButton.value = "登録";
            return false;
          }
        };

        const AccountName_P = document.createElement('p');
        const AccountName = document.createElement('input');
        AccountName.type = 'text';
        AccountName.autocomplete = 'username';
        AccountName.name = 'entry.159289474';
        AccountName.placeholder = 'アカウント名（英数字とアンダースコアのみ）';
        AccountName.required = true;
        AccountName.id = 'Account_Name';
        AccountName.maxLength = 20;
        AccountName.minLength = 3;
        AccountName_P.appendChild(AccountName);
        form.appendChild(AccountName_P);

        AccountName.addEventListener('focus', function() {
          this.select();
        });

        let checkTimeout;
        AccountName.addEventListener('input', function() {
          clearTimeout(checkTimeout);
          const username = this.value.trim();
          if (username.length >= 3) {
            checkTimeout = setTimeout(async () => {
              try {
                const isDuplicate = await checkDuplicateAccount(username);
                if (isDuplicate) {
                  this.style.borderColor = '#ff0000';
                  this.title = 'このアカウント名は既に使用されています';
                } else {
                  this.style.borderColor = '#00ff00';
                  this.title = 'このアカウント名は使用できます';
                }
              } catch (error) {
                this.style.borderColor = '';
                this.title = '';
              }
            }, 1000);
          } else {
            this.style.borderColor = '';
            this.title = '';
          }
        });

        const AccountPass_P = document.createElement('p');
        const AccountPass = document.createElement('input');
        AccountPass.type = 'password';
        AccountPass.autocomplete = 'new-password';
        AccountPass.name = 'entry.1949907076';
        AccountPass.placeholder = 'Password';
        AccountPass.required = true;
        AccountPass.id = 'Accounts_wcheck';
        AccountPass.minLength = 6;
        AccountPass_P.appendChild(AccountPass);
        form.appendChild(AccountPass_P);

        const Submit = document.createElement('input');
        Submit.type = "submit";
        Submit.id = "submitbutton";
        Submit.value = "登録";
        form.appendChild(Submit);

        document.body.appendChild(form);

        const iframe = document.createElement('iframe');
        iframe.onload = '';
        iframe.id = 'hidden_iframe';
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

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

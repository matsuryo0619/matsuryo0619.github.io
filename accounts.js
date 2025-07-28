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
          const AccountPassConfirmInput = document.getElementById('Accounts_wcheck_confirm');
          const password = AccountPassInput.value;
          const confirmPassword = AccountPassConfirmInput.value;
          const username = AccountNameInput.value;
          
          if (!password || !username || !confirmPassword) {
            alert('すべての項目を入力してください！');
            return false;
          }
          
          if (password !== confirmPassword) {
            alert('パスワードが一致しません！');
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
          if (password.length < 6) {
            alert('パスワードは6文字以上で入力してください！');
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
            AccountPassConfirmInput.value = '';
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
        // パスワードマネージャー用の属性追加
        AccountName.setAttribute('data-1p-ignore', 'false');
        AccountName.setAttribute('data-lpignore', 'false');
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
        AccountPass_P.style.position = 'relative';
        const AccountPass = document.createElement('input');
        AccountPass.type = 'password';
        AccountPass.autocomplete = 'new-password';
        AccountPass.name = 'entry.1949907076';
        AccountPass.placeholder = 'パスワード（6文字以上）';
        AccountPass.required = true;
        AccountPass.id = 'Accounts_wcheck';
        AccountPass.minLength = 6;
        // パスワードマネージャー用の属性追加
        AccountPass.setAttribute('data-1p-ignore', 'false');
        AccountPass.setAttribute('data-lpignore', 'false');
        // コピペ禁止
        AccountPass.addEventListener('copy', e => e.preventDefault());
        AccountPass.addEventListener('paste', e => e.preventDefault());
        AccountPass.addEventListener('cut', e => e.preventDefault());
        AccountPass.addEventListener('contextmenu', e => e.preventDefault());
        AccountPass.style.paddingRight = '40px';
        AccountPass_P.appendChild(AccountPass);
        
        // パスワード表示切り替えボタン
        const togglePassword1 = document.createElement('button');
        togglePassword1.type = 'button';
        togglePassword1.textContent = '👁';
        togglePassword1.style.position = 'absolute';
        togglePassword1.style.right = '10px';
        togglePassword1.style.top = '50%';
        togglePassword1.style.transform = 'translateY(-50%)';
        togglePassword1.style.border = 'none';
        togglePassword1.style.background = 'transparent';
        togglePassword1.style.cursor = 'pointer';
        togglePassword1.style.fontSize = '16px';
        togglePassword1.title = 'パスワードを表示/非表示';
        AccountPass_P.appendChild(togglePassword1);
        
        togglePassword1.addEventListener('click', function() {
          if (AccountPass.type === 'password') {
            AccountPass.type = 'text';
            this.textContent = '🙈';
          } else {
            AccountPass.type = 'password';
            this.textContent = '👁';
          }
        });
        
        form.appendChild(AccountPass_P);
        
        // パスワード確認入力フィールド
        const AccountPassConfirm_P = document.createElement('p');
        AccountPassConfirm_P.style.position = 'relative';
        const AccountPassConfirm = document.createElement('input');
        AccountPassConfirm.type = 'password';
        AccountPassConfirm.autocomplete = 'new-password';
        AccountPassConfirm.placeholder = 'パスワード確認';
        AccountPassConfirm.required = true;
        AccountPassConfirm.id = 'Accounts_wcheck_confirm';
        AccountPassConfirm.minLength = 6;
        // パスワードマネージャー用の属性追加
        AccountPassConfirm.setAttribute('data-1p-ignore', 'false');
        AccountPassConfirm.setAttribute('data-lpignore', 'false');
        // コピペ禁止
        AccountPassConfirm.addEventListener('copy', e => e.preventDefault());
        AccountPassConfirm.addEventListener('paste', e => e.preventDefault());
        AccountPassConfirm.addEventListener('cut', e => e.preventDefault());
        AccountPassConfirm.addEventListener('contextmenu', e => e.preventDefault());
        AccountPassConfirm.style.paddingRight = '40px';
        AccountPassConfirm_P.appendChild(AccountPassConfirm);
        
        // パスワード確認表示切り替えボタン
        const togglePassword2 = document.createElement('button');
        togglePassword2.type = 'button';
        togglePassword2.textContent = '👁';
        togglePassword2.style.position = 'absolute';
        togglePassword2.style.right = '10px';
        togglePassword2.style.top = '50%';
        togglePassword2.style.transform = 'translateY(-50%)';
        togglePassword2.style.border = 'none';
        togglePassword2.style.background = 'transparent';
        togglePassword2.style.cursor = 'pointer';
        togglePassword2.style.fontSize = '16px';
        togglePassword2.title = 'パスワードを表示/非表示';
        AccountPassConfirm_P.appendChild(togglePassword2);
        
        togglePassword2.addEventListener('click', function() {
          if (AccountPassConfirm.type === 'password') {
            AccountPassConfirm.type = 'text';
            this.textContent = '🙈';
          } else {
            AccountPassConfirm.type = 'password';
            this.textContent = '👁';
          }
        });
        
        // パスワード一致確認メッセージ表示用
        const passwordMessage = document.createElement('div');
        passwordMessage.id = 'password_message';
        passwordMessage.style.fontSize = '14px';
        passwordMessage.style.marginTop = '5px';
        passwordMessage.style.minHeight = '20px';
        AccountPassConfirm_P.appendChild(passwordMessage);
        
        form.appendChild(AccountPassConfirm_P);
        
        // パスワード一致確認
        function checkPasswordMatch() {
          const password = AccountPass.value;
          const confirmPassword = AccountPassConfirm.value;
          const messageDiv = document.getElementById('password_message');
          
          if (confirmPassword.length === 0) {
            messageDiv.textContent = '';
            AccountPassConfirm.style.borderColor = '';
            return true;
          }
          
          if (password === confirmPassword) {
            messageDiv.textContent = '✓ パスワードが一致しています';
            messageDiv.style.color = '#00aa00';
            AccountPassConfirm.style.borderColor = '#00aa00';
            return true;
          } else {
            messageDiv.textContent = '✗ パスワードが一致しません';
            messageDiv.style.color = '#ff0000';
            AccountPassConfirm.style.borderColor = '#ff0000';
            return false;
          }
        }
        
        AccountPass.addEventListener('input', checkPasswordMatch);
        AccountPassConfirm.addEventListener('input', checkPasswordMatch);
        const Submit = document.createElement('input');
        Submit.type = "submit";
        Submit.id = "submitbutton";
        Submit.value = "登録";
        // パスワードマネージャーがフォーム送信を検知できるように
        Submit.setAttribute('data-1p-ignore', 'false');
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
        
        // ログイン用のアカウント情報取得関数
        async function getAccountData(username) {
          try {
            const timestamp = new Date().getTime();
            const csvUrl = `${GOOGLE_SHEET_CSV_URL}&_t=${timestamp}`;
            const existingAccounts = await d3.csv(csvUrl);
            
            const possibleAccountNameColumns = [
              'アカウント名', 'ユーザー名', 'Account Name', 'Username'
            ];
            
            if (existingAccounts.length === 0) {
              return null;
            }
            
            const availableColumns = Object.keys(existingAccounts[0]);
            const accountNameColumn = possibleAccountNameColumns.find(col => availableColumns.includes(col)) || availableColumns[1];
            
            const account = existingAccounts.find(row => {
              const existingUsername = row[accountNameColumn];
              return existingUsername && existingUsername.toString().trim().toLowerCase() === username.trim().toLowerCase();
            });
            
            if (!account) {
              return null;
            }
            
            return {
              username: account[accountNameColumn],
              hashedPassword: account['ハッシュ化パスワード'] || account['Hashed Password'],
              salt: account['ソルト'] || account['Salt']
            };
          } catch (error) {
            console.error('アカウントデータ取得エラー:', error);
            throw new Error('アカウント情報の取得に失敗しました。しばらく待ってから再試行してください。');
          }
        }
        
        // パスワード検証関数
        async function verifyPassword(inputPassword, storedHash, salt) {
          try {
            const combined = inputPassword + salt;
            const encoder = new TextEncoder();
            const dataToHash = encoder.encode(combined);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // ハッシュから末尾のカンマとスペースを除去
            const cleanStoredHash = storedHash.replace(/,\s*$/, '').trim();
            
            return computedHash === cleanStoredHash;
          } catch (error) {
            console.error('パスワード検証エラー:', error);
            return false;
          }
        }
        
        // ログインフォーム作成
        const loginForm = document.createElement('form');
        loginForm.id = 'login_form';
        
        loginForm.onsubmit = async function(event) {
          event.preventDefault();
          
          const usernameInput = document.getElementById('Login_Username');
          const passwordInput = document.getElementById('Login_Password');
          const submitButton = document.getElementById('login_submitbutton');
          
          const username = usernameInput.value.trim();
          const password = passwordInput.value;
          
          if (!username || !password) {
            alert('アカウント名とパスワードを両方入力してください！');
            return false;
          }
          
          submitButton.disabled = true;
          submitButton.value = "ログイン中...";
          
          try {
            const accountData = await getAccountData(username);
            
            if (!accountData) {
              alert('アカウント名またはパスワードが間違っています。');
              submitButton.disabled = false;
              submitButton.value = "ログイン";
              return false;
            }
            
            const isPasswordValid = await verifyPassword(password, accountData.hashedPassword, accountData.salt);
            
            if (!isPasswordValid) {
              alert('アカウント名またはパスワードが間違っています。');
              submitButton.disabled = false;
              submitButton.value = "ログイン";
              return false;
            }
            
            // ログイン成功
            localStorage.setItem('account', accountData.username);
            const sessionToken = secureAuth.generateSessionToken();
            secureAuth.setAuthData(accountData.username, sessionToken);
            
            window.location.replace('https://matsuryo0619.github.io/scratchblog/Home.html');
            
          } catch (error) {
            console.error('ログイン処理エラー:', error);
            alert(error.message || 'ログイン処理中にエラーが発生しました。もう一度試してみてください！');
            submitButton.disabled = false;
            submitButton.value = "ログイン";
          }
        };
        
        // ユーザー名入力フィールド
        const usernameP = document.createElement('p');
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.autocomplete = 'username';
        usernameInput.placeholder = 'アカウント名';
        usernameInput.required = true;
        usernameInput.id = 'Login_Username';
        // パスワードマネージャー用の属性追加
        usernameInput.setAttribute('data-1p-ignore', 'false');
        usernameInput.setAttribute('data-lpignore', 'false');
        usernameP.appendChild(usernameInput);
        
        // アカウント存在確認メッセージ表示用
        const usernameMessage = document.createElement('div');
        usernameMessage.id = 'username_message';
        usernameMessage.style.fontSize = '14px';
        usernameMessage.style.marginTop = '5px';
        usernameMessage.style.minHeight = '20px';
        usernameP.appendChild(usernameMessage);
        
        loginForm.appendChild(usernameP);
        
        usernameInput.addEventListener('focus', function() {
          this.select();
        });
        
        // リアルタイムアカウント存在確認
        let usernameCheckTimeout;
        usernameInput.addEventListener('input', function() {
          clearTimeout(usernameCheckTimeout);
          const username = this.value.trim();
          const messageDiv = document.getElementById('username_message');
          
          if (username.length === 0) {
            messageDiv.textContent = '';
            this.style.borderColor = '';
            return;
          }
          
          if (username.length < 3) {
            messageDiv.textContent = 'アカウント名は3文字以上で入力してください';
            messageDiv.style.color = '#888';
            this.style.borderColor = '';
            return;
          }
          
          // 入力中表示
          messageDiv.textContent = '確認中...';
          messageDiv.style.color = '#888';
          this.style.borderColor = '';
          
          usernameCheckTimeout = setTimeout(async () => {
            try {
              const accountData = await getAccountData(username);
              if (accountData) {
                messageDiv.textContent = '✓ アカウントが見つかりました';
                messageDiv.style.color = '#00aa00';
                this.style.borderColor = '#00aa00';
              } else {
                messageDiv.textContent = '✗ アカウントは存在しません';
                messageDiv.style.color = '#ff0000';
                this.style.borderColor = '#ff0000';
              }
            } catch (error) {
              messageDiv.textContent = '確認できませんでした';
              messageDiv.style.color = '#ff6600';
              this.style.borderColor = '';
            }
          }, 800);
        });
        
        // パスワード入力フィールド
        const passwordP = document.createElement('p');
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.autocomplete = 'current-password';
        passwordInput.placeholder = 'パスワード';
        passwordInput.required = true;
        passwordInput.id = 'Login_Password';
        // パスワードマネージャー用の属性追加
        passwordInput.setAttribute('data-1p-ignore', 'false');
        passwordInput.setAttribute('data-lpignore', 'false');
        passwordP.appendChild(passwordInput);
        loginForm.appendChild(passwordP);
        
        // ログインボタン
        const loginSubmit = document.createElement('input');
        loginSubmit.type = "submit";
        loginSubmit.id = "login_submitbutton";
        loginSubmit.value = "ログイン";
        // パスワードマネージャーがフォーム送信を検知できるように
        loginSubmit.setAttribute('data-1p-ignore', 'false');
        loginForm.appendChild(loginSubmit);
        
        // アカウント作成リンク
        const createAccountP = document.createElement('p');
        const createAccountLink = document.createElement('a');
        createAccountLink.href = 'https://matsuryo0619.github.io/scratchblog/accounts.html?type=make';
        createAccountLink.textContent = 'アカウントを作成';
        createAccountP.appendChild(createAccountLink);
        loginForm.appendChild(createAccountP);
        
        document.body.appendChild(loginForm);
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

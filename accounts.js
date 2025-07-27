window.addEventListener('headerSearchCreated', async () => {
  const { accounts_parent } = await import('./header.js');
  const Make_accounts = document.getElementById('header_Toaccounts');
  const login = document.getElementById('header_Tologin');
  const urlParams = new URLSearchParams(window.location.search);

  // GoogleスプレッドシートのCSVエクスポートURLをここに設定するよ！
  // ★重要★ スプレッドシートの公開設定を「ウェブに公開」にしてね！
  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1E0MjL8CXf-_pF3Lf1K1-w0pMx3EEaLO_zimIPpIkkPk/export?format=csv&range=A2:D';

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
        
        // ソルト用の隠し入力フィールドを追加
        const saltInput = document.createElement('input');
        saltInput.type = 'hidden';
        saltInput.name = 'entry.155315392'; 
        form.appendChild(saltInput);

        // ハッシュ化されたパスワード用の隠し入力フィールドを追加
        const hashedPasswordInput = document.createElement('input');
        hashedPasswordInput.type = 'hidden';
        hashedPasswordInput.name = 'entry.1949907076'; 
        form.appendChild(hashedPasswordInput);

        form.onsubmit = async function(event) {
          event.preventDefault(); // デフォルトのフォーム送信を一旦停止！

          const AccountNameInput = document.getElementById('Account_Name'); // ユーザー名入力フィールドを取得
          const AccountPassInput = document.getElementById('Accounts_wcheck');
          const password = AccountPassInput.value;
          const username = AccountNameInput.value;

          if (!password || !username) {
            alert('アカウント名とパスワードを両方入力してください！');
            return false;
          }

          document.getElementById("submitbutton").disabled = true; // 送信ボタンを無効化！

          try {
            // ★D3.jsでGoogleスプレッドシートのCSVデータを読み込むよ！★
            const existingAccounts = await d3.csv(GOOGLE_SHEET_CSV_URL);
            
            // スプレッドシートの2列目（インデックス1）にアカウント名が入っていると仮定して重複をチェックするね！
            // もしスプレッドシートの列名が分かっているなら `row['アカウント名']` のように変更してもOKだよん
            const isDuplicate = existingAccounts.some(row => row[Object.keys(row)[1]] === username);

            if (isDuplicate) {
              alert('そのアカウント名はすでに使われています。別のアカウント名を入力してください！');
              document.getElementById("submitbutton").disabled = false;
              return false; // 重複があったら送信中止！
            }

            // ソルトを生成 (Web Cryptography APIを使って安全にランダムなバイトを生成)
            const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
            const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            saltInput.value = salt;

            // パスワードとソルトを結合してハッシュ化
            const combined = password + salt;
            const encoder = new TextEncoder();
            const dataToHash = encoder.encode(combined);
            
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            hashedPasswordInput.value = hashedPassword;
            AccountPassInput.value = ''; // 元のパスワード入力フィールドはクリア！

            // iframeにGoogleフォームのレスポンスが読み込まれたら実行される処理だよん
            document.getElementById('hidden_iframe').onload = function() {
                alert('アカウントの登録が完了しました！'); 
                document.getElementById("submitbutton").disabled = false; 
                form.reset(); 
                
                localStorage.setItem('account', username); 
                window.location.href = 'https://matsuryo0619.github.io/scratchblog/Home.html'; // 絶対パスでリダイレクト！
            };

            // フォームを最終的に送信するよ！
            form.submit(); 

          } catch (error) {
            console.error('データの読み込みまたはハッシュ化エラー:', error);
            alert('処理中にエラーが発生したよ。もう一度試してみてね！');
            document.getElementById("submitbutton").disabled = false;
            return false;
          }
        };

        const AccountName_P = document.createElement('p');
        const AccountName = document.createElement('input');
        AccountName.type = 'text';
        AccountName.autocomplete = 'username';
        AccountName.name = 'entry.159289474'; 
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
        AccountPass.name = 'entry.1949907076'; 
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

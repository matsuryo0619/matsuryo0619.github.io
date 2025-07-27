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
        form.target = 'hidden_iframe'; 
        
        // ソルト用の隠し入力フィールドを追加
        const saltInput = document.createElement('input');
        saltInput.type = 'hidden';
        saltInput.name = 'entry.155315392'; // ★ここをいただいたソルトのエントリーIDに修正したよ！★
        form.appendChild(saltInput);

        // ハッシュ化されたパスワード用の隠し入力フィールドを追加
        const hashedPasswordInput = document.createElement('input');
        hashedPasswordInput.type = 'hidden';
        hashedPasswordInput.name = 'entry.1949907076'; // ★ここをいただいたパスワードのエントリーIDに修正したよ！★
        form.appendChild(hashedPasswordInput);

        form.onsubmit = async function(event) {
          event.preventDefault(); // デフォルトのフォーム送信を一旦停止！

          const AccountPass = document.getElementById('Accounts_wcheck');
          const AccountName = document.getElementById('Account_Name');
          const password = AccountPass.value;
          const username = AccountName.value;

          if (!password || !username) {
            alert('どちらとも入力してください');
            return false;
          }

          document.getElementById("submitbutton").disabled = true; // 送信ボタンを無効化！

          // ソルトを生成 (Web Cryptography APIを使って安全にランダムなバイトを生成)
          const saltBytes = window.crypto.getRandomValues(new Uint8Array(16)); // 16バイトのランダムなソルト
          const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join(''); // 16進数文字列に変換
          saltInput.value = salt; // 生成したソルトを隠しフィールドに入れるよん

          // パスワードとソルトを結合してハッシュ化
          const combined = password + salt;
          const encoder = new TextEncoder();
          const data = encoder.encode(combined);
          
          try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', data); // SHA-256でハッシュ化！
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // 16進数文字列に変換

            hashedPasswordInput.value = hashedPassword; // ハッシュ化されたパスワードを隠しフィールドに入れるよん

            // 元のパスワード入力フィールドはクリア！
            AccountPass.value = '';

            // iframeにGoogleフォームのレスポンスが読み込まれたら実行される処理だよん
            document.getElementById('hidden_iframe').onload = function() {
                alert('アカウントの登録が完了しました！'); // 完了メッセージだよん
                document.getElementById("submitbutton").disabled = false; // 送信ボタンを有効に戻すよ！
                form.reset(); // フォームの中身をクリアするね！
                localStorage.setItem('account', username)
                window.location = 'https://matsuryo0619.github.io/scratchblog/Home.html';
                // reset()で隠しフィールドがクリアされるので、必要なら onload の後に再度値をセットする必要があるかも
            };

            // フォームを最終的に送信するよ！
            form.submit(); 

          } catch (error) {
            console.error('ハッシュ化エラー:', error);
            alert('パスワードの処理中にエラーが発生したよ。もう一度試してみてね！');
            document.getElementById("submitbutton").disabled = false;
            return false;
          }
        };

        const AccountName_P = document.createElement('p');
        const AccountName = document.createElement('input');
        AccountName.type = 'text';
        AccountName.autocomplete = 'username';
        AccountName.name = 'entry.159289474'; // ★ここをいただいたアカウント名のエントリーIDに修正したよ！★
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
        AccountPass.name = 'entry.1949907076'; // ★元のパスワード入力欄もいただいたIDに修正したよ！★
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

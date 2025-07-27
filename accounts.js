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
        
        // ★ここからパスワードハッシュ化のロジックを追加するよん！★
        // ソルト用の隠し入力フィールドを追加
        const saltInput = document.createElement('input');
        saltInput.type = 'hidden';
        saltInput.name = 'entry.951058468'; // ソルトを送信するエントリーID
        form.appendChild(saltInput);

        // パスワード用の隠し入力フィールドを追加 (ハッシュ化されたパスワードを送信するため)
        const hashedPasswordInput = document.createElement('input');
        hashedPasswordInput.type = 'hidden';
        // 元のパスワード入力フィールドと同じ名前で送信されるようにする（Googleフォームの指定に合わせてね）
        hashedPasswordInput.name = 'entry.1714274511'; 
        form.appendChild(hashedPasswordInput);

        form.onsubmit = async function(event) {
          event.preventDefault(); // デフォルトのフォーム送信を一旦停止するよ！

          const AccountPass = document.getElementById('Accounts_wcheck');
          const password = AccountPass.value;

          if (!password) {
            alert('パスワードを入力してね！');
            return false;
          }

          document.getElementById("submitbutton").disabled = true; // 送信ボタンを無効化！

          // ソルトを生成 (ここではシンプルな例としてUUIDを使うけど、よりセキュアなランダムバイト推奨だよん)
          // 実際の運用では、`window.crypto.getRandomValues(new Uint8Array(16))` などを使ってね！
          const salt = crypto.randomUUID(); // ランダムなソルトを生成！
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

            // 元のパスワード入力フィールドはクリアしとくのが安全だよ！
            AccountPass.value = '';

            // iframeにGoogleフォームのレスポンスが読み込まれたら実行される処理だよん
            document.getElementById('hidden_iframe').onload = function() {
                alert('アカウントの登録が完了しました！'); // 完了メッセージだよん
                document.getElementById("submitbutton").disabled = false; // 送信ボタンを有効に戻すよ！
                form.reset(); // フォームの中身をクリアするね！
                // ただし、reset()だとhiddenフィールドもクリアされちゃうから、
                // 必要に応じて個別に値設定し直すか、hiddenフィールドをresetの対象外にする工夫が必要かも！
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
        // ★ここまで★

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
        AccountPass.name = 'entry.1714274511'; // ここがハッシュ化される前のパスワードの入力欄だよ
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

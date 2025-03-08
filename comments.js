document.addEventListener('PageFinish', function() {
  // NGワードのリスト
  const NGComments = ["死ね", "バカ", ".exe"];
  const regex = new RegExp(NGComments.join("|"));

  // コメントチェック関数
  function test(wcheck) {
    if (wcheck.match(regex) != null) {
      alert("ERROR: コメントにNGワードが含まれています");
      return false;
    }
    return true;
  }

  // URLパラメータを取得する関数
  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  // Googleフォームを作成する関数
  function createGoogleForm() {
    const formId = "1FAIpQLSeJi8SiLCAtUaep3Z7wGK0H2OZosK_YEaRMo7vxB_VEFrWq8g";
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    const form = document.createElement("form");
    form.action = formUrl;
    form.method = "post";
    form.id = 'Comment_form';

    // 名前入力欄
    const nameParagraph = document.createElement("p");
    const nameInput = document.createElement("input");
    nameInput.name = "entry.691642850";
    nameInput.placeholder = "スクラッチネーム";
    nameInput.value = "匿名";
    nameInput.required = true;
    nameParagraph.appendChild(nameInput);
    form.appendChild(nameParagraph);

    // コメント入力欄
    const commentParagraph = document.createElement("p");
    const commentTextarea = document.createElement("textarea");
    commentTextarea.name = "entry.1605539997";
    commentTextarea.placeholder = "コメント";
    commentTextarea.rows = 10;
    commentTextarea.cols = 40;
    commentTextarea.maxLength = 400;
    commentTextarea.id = "Comments_wcheck";
    commentTextarea.required = true;
    commentParagraph.appendChild(commentTextarea);
    form.appendChild(commentParagraph);

    // URLパラメータを hidden フィールドに追加
    const dataValue = getUrlParameter("data");
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "entry.148490561";
    hiddenInput.value = "art" + dataValue;
    form.appendChild(hiddenInput);

    // 送信ボタン
    const submitInput = document.createElement("input");
    submitInput.type = "submit";
    submitInput.id = "submitbutton";
    submitInput.value = "送信";
    form.appendChild(submitInput);

    // フォームを追加
    const content = document.getElementById('Rough_menu');
    content.appendChild(form);

    // 送信ボタンを無効にする関数
    document.getElementById("submitbutton").disabled = true;

    // テキストエリアの入力があればボタンを有効にする
    const textareas = document.getElementsByTagName('textarea');
    const inputs = document.getElementsByTagName('input');
    
    // コメントが入力されていればボタンを有効にする
    Array.from(textareas).forEach(function(textarea) {
      textarea.addEventListener('input', function() {
        if (textarea.value.trim() !== "") {
          submitInput.disabled = false; // ボタンを有効にする
        } else {
          submitInput.disabled = true; // ボタンを無効にする
        }
      });
    });

    // フォーム送信時のカスタム処理
    form.onsubmit = function(event) {
      event.preventDefault(); // リダイレクトを防ぐために、デフォルトの送信処理をキャンセル

      // コメントにNGワードが含まれていなければ送信
      if (!test(document.getElementById("Comments_wcheck").value)) {
        return false;
      }

      // 送信ボタンを無効化して、送信完了状態にする
      document.getElementById("submitbutton").disabled = true;

      // ここでフォームを実際に送信
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      form.target = "hidden_iframe"; // iframeをターゲットに指定
      form.submit(); // フォーム送信

      // 送信後、1秒待ってページをリロードし、スクロール位置を復元
      const scrollY = window.scrollY;
      setTimeout(() => {
        location.reload();
        window.scrollTo(0, scrollY);
      }, 1000);

      return true; // フォーム送信を許可
    };
  }

  // フォーム生成
  createGoogleForm();

  // コメント表示エリア
  const comments = document.createElement('div');
  comments.id = 'comments';
  document.getElementById('Rough_menu').appendChild(comments);

  // d3.v6のfetchを使用してCSVを読み込み
  fetch("https://docs.google.com/spreadsheets/d/14j4HxVdHec5ELwRGyZKpehI8hM8Jpa1AppqqK3pKUA4/export?format=csv&range=A1:D")
    .then(response => response.text())
    .then(function(csvText) {
      // CSVの読み込みとパース
      const data = d3.csvParse(csvText);

      // データの逆順に
      data.reverse();

      let text = "";
      data.forEach((entry, i) => {
        const name = entry["ペンネーム"]; // ペンネームを取得
        const timestamp = entry["タイムスタンプ"];
        const commentsText = entry["コメント"];

        if (name === "匿名") {
          text += `
            ${data.length - i} 名前: <p>匿名</p> ${timestamp} 
            <pre>${commentsText}</pre>
          `;
        } else {
          text += `
            ${data.length - i} 名前: <a href="https://scratch.mit.edu/users/${name}/" target="_blank">${name}</a> ${timestamp} 
            <pre>${commentsText}</pre>
          `;
        }
      });
      document.getElementById("comments").innerHTML = text;
    })
    .catch(function(error) {
      console.error("コメントデータの読み込みに失敗しました:", error);
    });
});

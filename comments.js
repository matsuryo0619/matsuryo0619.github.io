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

    // 送信ボタンを無効にする
    document.getElementById("submitbutton").disabled = true;

    // テキストエリアの入力があればボタンを有効にする
    commentTextarea.addEventListener('input', function() {
      submitInput.disabled = commentTextarea.value.trim() === "";
    });

    // フォーム送信時のカスタム処理
    form.onsubmit = function(event) {
      event.preventDefault(); // デフォルトの送信処理をキャンセル

      if (!test(commentTextarea.value)) return false;

      submitInput.disabled = true;

      // ここでフォームを送信
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      form.target = "hidden_iframe";
      form.submit();

      // 送信後、1秒待ってページをリロードし、スクロール位置を復元
      const scrollY = window.scrollY;
      setTimeout(() => {
        location.reload();
        window.scrollTo(0, scrollY);
      }, 1000);

      return true;
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
      const data = d3.csvParse(csvText);
      data.reverse();

      const This_siteID = 'art' + getUrlParameter("data");

      // art1 だけをフィルタリング
      const filteredData = data.filter(entry => entry["サイトID"] === This_siteID);

      let text = "";
      filteredData.forEach((entry, index) => {
        const name = entry["ペンネーム"];
        const timestamp = entry["タイムスタンプ"];
        const commentsText = entry["コメント"];

        if (name === "匿名" || !/^[a-zA-Z\s]+$/.test(name)) {
          text += `
            ${filteredData.length - index} 名前: ${name} ${timestamp} 
            <pre>${commentsText}</pre>
          `;
        } else {
          text += `
            ${filteredData.length - index} 名前: <a href="https://scratch.mit.edu/users/${name}/" target="_blank">${name}</a> ${timestamp} 
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

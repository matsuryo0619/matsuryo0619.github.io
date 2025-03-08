document.addEventListener('PageFinish', function() {
  // NGワードリスト
  var NGComments = ["死ね", "バカ", ".exe"];
  var regex = new RegExp("\\b(" + NGComments.join("|") + ")\\b");

  // NGワードチェック
  function test(wcheck) {
    if (regex.test(wcheck)) {
      alert("ERROR: コメントにNGワードが含まれています");
      return false;
    }
    return true;
  }

  // URLパラメータ取得
  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  // Googleフォーム作成
  function createGoogleForm() {
    const formId = "1FAIpQLSeJi8SiLCAtUaep3Z7wGK0H2OZosK_YEaRMo7vxB_VEFrWq8g";
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    const form = document.createElement("form");
    form.action = formUrl;
    form.method = "post";
    form.id = 'Comment_form';
    form.target = "hidden_iframe";

    // フォーム送信時の処理
    form.onsubmit = function() {
      const commentField = document.getElementById("Comments_wcheck").value;

      if (!test(commentField)) return false; // NGワードが含まれていれば送信しない

      sessionStorage.setItem("scrollY", window.scrollY); // スクロール位置保存
      return true; // フォーム送信許可
    };

    // 名前入力欄
    const nameInput = document.createElement("input");
    nameInput.name = "entry.691642850";
    nameInput.placeholder = "名前";
    nameInput.value = "名無し";
    nameInput.required = true;

    // コメント入力欄
    const commentTextarea = document.createElement("textarea");
    commentTextarea.name = "entry.1605539997";
    commentTextarea.placeholder = "コメント";
    commentTextarea.rows = 10;
    commentTextarea.cols = 40;
    commentTextarea.maxLength = 400;
    commentTextarea.id = "Comments_wcheck";
    commentTextarea.required = true;

    // URLパラメータをhiddenでフォームに追加
    const dataValue = getUrlParameter("data");
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "entry.148490561";
    hiddenInput.value = "art" + dataValue;

    // 送信ボタン
    const submitInput = document.createElement("input");
    submitInput.type = "submit";
    submitInput.id = "submitbutton";
    submitInput.value = "送信";

    // フォームに要素を追加
    form.appendChild(nameInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(commentTextarea);
    form.appendChild(hiddenInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(submitInput);

    // フォームをDOMに追加
    document.getElementById('content').appendChild(form);

    // hidden iframe（リダイレクトを防ぐため）
    const hiddenIframe = document.createElement("iframe");
    hiddenIframe.name = "hidden_iframe";
    hiddenIframe.style.display = "none";
    document.body.appendChild(hiddenIframe);
  }

  // Googleフォームの生成
  createGoogleForm();

  // コメント表示エリア
  const commentsDiv = document.createElement('div');
  commentsDiv.id = 'comments';
  document.getElementById('content').appendChild(commentsDiv);

  // CSVデータを非同期で取得
  async function loadComments() {
    try {
      const response = await d3.csv("https://docs.google.com/spreadsheets/d/14j4HxVdHec5ELwRGyZKpehI8hM8Jpa1AppqqK3pKUA4/export?format=csv&range=A2:D");
      response.reverse();
      function replaceText(text) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      let text = "";
      response.forEach((data, i) => {
        let name = replaceText(data.Name);
        let mail = replaceText(data.Mail);
        let timestamp = replaceText(data.Timestamp);
        let comments = replaceText(data.Comments);
        text += `${i + 1} 名前: <a href="mailto:${mail}">${name}</a> ${timestamp} <pre>${comments}</pre>`;
      });

      document.getElementById("comments").innerHTML = text;
    } catch (error) {
      console.error("コメントデータの読み込みに失敗しました:", error);
    }
  }

  // コメントデータの読み込み
  loadComments();

  // ページ読み込み時にスクロール位置を復元
  window.onload = function() {
    const savedScrollY = sessionStorage.getItem("scrollY");
    if (savedScrollY !== null) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      sessionStorage.removeItem("scrollY"); // 復元後に削除
    }
  };
});

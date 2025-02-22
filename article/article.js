document.addEventListener('DOMContentLoaded', function () {
  // URLからdataを取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  // ファイルを読み込む
  fetch('https://matsuryo0619.github.io/scratchblog/article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      // YAMLをJavaScriptオブジェクトへ
      const pagesData = jsyaml.load(yamlData);
      const pagekey = `art${sitedata}`;
      const pageData = pagesData.pages[pagekey];
      const container = document.createElement('div');

      if (pageData) {
        // 🔥 `<タグ t>` の `t>` を `>` に変換
        let formattedContent = pageData.content.replace(/<(\w+)\s*t>/g, "<$1>");

        // 🔥 `<tタグ>` を `<タグ>` に変換
        formattedContent = formattedContent.replace(/<t(\w+)>/g, "<$1>");

        // 🔥 **HTMLタグをエスケープして「そのまま表示」**
        formattedContent = formattedContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // コンテンツをセット
        container.id = 'content';
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <pre>${formattedContent}</pre>
        `;

      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
      }

      document.body.appendChild(container);
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

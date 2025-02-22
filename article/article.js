document.addEventListener('DOMContentLoaded', function() {
  // URLから data を取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  // ファイルを読み込む
  fetch('https://matsuryo0619.github.io/scratchblog/article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      // YAMLをJavaScriptオブジェクトに変換
      const pagesData = jsyaml.load(yamlData);

      // 動的にキーを作成
      const pagekey = `art${sitedata}`;

      // `pageData` を取得
      const pageData = pagesData.pages[pagekey];

      // コンテンツを表示する div を作成
      const container = document.createElement('div');
      container.id = 'content';

      if (pageData) {
        // `t>` を削除して通常のタグに変換
        const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>");

        // HTMLを設定
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p>${pageData.data}</p>
          <div>${formattedContent}</div>
        `;
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
      }

      // `document` ではなく `body` に追加する
      document.body.appendChild(container);
    })
    .catch(error => console.error('YAML読み込みエラー:', error)); // エラーハンドリング
});

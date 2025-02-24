document.addEventListener('DOMContentLoaded', function() {
  // URLからdataを取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  // YAMLファイルを読み込む
  fetch('https://matsuryo0619.github.io/scratchblog/article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      // YAMLをJavaScriptオブジェクトへ変換
      const pagesData = jsyaml.load(yamlData);
      
      // 動的にキーを作成
      const pagekey = `art${sitedata}`;
      // ページデータを取得
      const pageData = pagesData.pages[pagekey];
      const container = document.createElement('div');

      if (pageData) {
        // 記事内容の整形と表示
        const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>"); // <h3 t> → <h3>

        container.id = 'content';
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <div>${formattedContent}</div>
        `;
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
      }

      document.body.appendChild(container);

      // action 部分のJavaScriptを実行する
      const actionCode = pageData.action;
      if (actionCode) {
        try {
          // YAMLから取得したJavaScriptコードを評価して実行
          eval(actionCode);
        } catch (error) {
          console.error('Actionコードの実行中にエラーが発生しました:', error);
        }
      }
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

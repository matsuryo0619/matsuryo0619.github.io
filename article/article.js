document.addEventListener('DOMContentLoaded', function() {
  // URLからdataを取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  // YAMLファイルを読み込む
  fetch('https://matsuryo0619.github.io/scratchblog/Article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      // YAMLをJavaScriptオブジェクトへ変換
      const pagesData = jsyaml.load(yamlData);

      // 動的にキーを作成
      const pagekey = `art${sitedata}`;
      // ページデータを取得
      const pageData = pagesData.pages[pagekey];
      const container = document.createElement('div');

      if (pageData && (pageData.public)) {
        // 記事内容の整形と表示
        const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>"); // <h3 t> → <h3>

        container.id = 'content';
        container.innerHTML = `
          <h1 id="content_title">${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <div id="Rough_menu">${formattedContent}</div>
        `;
        document.title = `${pageData.title} - スゴスク!`;

        document.body.appendChild(container);

        // 🛠 actionスクリプトをheadに追加
        if (pageData.action) {
          addScriptToHead(pageData.action);
        }
        //スタイルをheadに追加
        if (pageData.style) {
          addStyleToHead(pageData.style);
        }
      } else if(!pageData.public) {
        container.innerHTML = "<p>指定されたページは公開されていません</p>";
        document.body.appendChild(container);
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
        document.body.appendChild(container);
      }
      //ページ作成を知らせるカスタムイベント
      const PageFinish = new CustomEvent('PageFinish');
      document.dispatchEvent(PageFinish);
    })
    .catch(error => console.error('YAML読み込みエラー', error));

  // 🛠 actionスクリプトを<head>に追加する関数
  function addScriptToHead(scriptContent) {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.textContent = scriptContent;
    document.head.appendChild(scriptElement);
  }

  function addStyleToHead(styleContent) {
    const StyleElement = document.createElement('style');
    StyleElement.type = 'text/css';
    StyleElement.textContent = styleContent;
    document.head.appendChild(StyleElement);
  }
});

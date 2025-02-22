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

      // メニュー（目次）の作成
      const menu = document.createElement('div');
      menu.id = 'menu';
      
      // Object.keysでページのキーを取得してループ
      Object.keys(pagesData.pages).forEach((key) => {
        const page = pagesData.pages[key];
        if (page.title) {
          const menuItem = document.createElement('p');
          menuItem.classList.add('menu-item');
          menuItem.innerHTML = `<a href="?data=${key}">${page.title}</a>`;
          menu.appendChild(menuItem);
        }
      });
      
      // メニューをページに追加
      document.body.appendChild(menu);

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
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

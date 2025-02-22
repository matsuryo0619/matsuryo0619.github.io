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
      menu.classList.add('menu');

      // ページ内でクラスが"menu"かつIDを持つ要素を探す
      const sections = document.querySelectorAll('.menu[id]');
      const menuList = document.createElement('div');
      menuList.classList.add('menu-list');

      // それぞれのIDを持つ要素を目次に追加
      sections.forEach((section) => {
        const id = section.id;
        const title = section.textContent || section.innerText;  // タイトルを取得

        const menuItem = document.createElement('p');
        menuItem.classList.add('menu-item');
        menuItem.innerHTML = `<a href="#${id}">${title}</a>`;  // IDに基づいてリンクを生成
        
        // クリックイベントでスクロール
        menuItem.addEventListener("click", () => {
          const item = document.getElementById(id);
          if (item) {
            item.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });

        menuList.appendChild(menuItem);
      });

      // メニューをページに追加
      menu.appendChild(menuList);
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

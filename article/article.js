document.addEventListener('DOMContentLoaded', function () {
  // メニューを作成（目次用）
  function createMenu(pagesData) {
    const menu = document.createElement('div');
    menu.id = 'menu';

    // メニュー用コンテンツ（div内にpタグでタイトルを追加）
    const sections = pagesData.pages;
    let menuHTML = '';
    
    Object.keys(sections).forEach((key) => {
      const page = sections[key];
      
      // ページデータ内で.id属性がある.titleクラスを持つ要素を探して、pタグに追加
      const titleElements = page.content.match(/<p[^>]*class=["'][^"']*title[^"']*["'][^>]*id=["'][^"']*["'][^>]*>.*?<\/p>/g);

      if (titleElements) {
        // その要素ごとに、メニューを追加する
        titleElements.forEach((element, index) => {
          // <p>要素からテキストを取り出して表示
          const textContent = element.replace(/<.*?>/g, ''); // タグを除去したテキストを取得
          menuHTML += `
            <div class="menu-item">
              <p class="title" id="${key}-${index}">${textContent}</p>
            </div>
          `;
        });
      }
    });

    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);
  }

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
          <div id="${pagekey}">${formattedContent}</div>
        `;

      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
      }

      document.body.appendChild(container);
      
      // 目次を作成
      createMenu(pagesData);
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

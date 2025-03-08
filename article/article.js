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

      if (pageData && pageData.public) {
        // 記事内容の整形と表示
        const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>"); // <h3 t> → <h3>

        container.id = 'content';
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <div id="Rough_menu">${formattedContent}</div>
        `;
        document.title = `${pageData.title} - スゴスク!`;

        document.body.appendChild(container);

        // 🛠 actionスクリプトをheadに追加
        if (pageData.action) {
          addScriptToHead(pageData.action);
        }

        // 🛠 スタイルをheadに追加（nullや空文字チェックを追加！）
        if (pageData.style && pageData.style.trim() !== "") {
          addStyleToHead(pageData.style);
        }
      } else if (pageData && !pageData.public) {
        container.innerHTML = "<p>指定されたページは公開されていません</p>";
        document.body.appendChild(container);
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
        document.body.appendChild(container);
      }

      // ページ作成を知らせるカスタムイベント
      const PageFinish = new CustomEvent('PageFinish');
      document.dispatchEvent(PageFinish);

      // メニュー開閉のボタンを追加
      document.querySelectorAll(".Mainmenu").forEach(menu => {
        let button = document.createElement('button');
        button.textContent = "▼";
        button.classList.add('toggleButton');

        let h1 = menu.querySelector('h1');
        h1.style.display = 'inline-block';
        h1.after(button);

        let wrapper = document.createElement("div");
        wrapper.classList.add("contentWrapper");

        let content = Array.from(menu.children).slice(1); // 修正: Array.form → Array.from
        content.forEach(el => wrapper.appendChild(el));
        menu.appendChild(wrapper);

        button.addEventListener('click', function() {
          wrapper.classList.toggle("open");
          button.textContent = wrapper.classList.contains("open") ? "▲" : "▼";
        });
      });
    })
    .catch(error => console.error('YAML読み込みエラー', error));

  // 🛠 actionスクリプトを<head>に追加する関数
  function addScriptToHead(scriptContent) {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.textContent = scriptContent;
    document.head.appendChild(scriptElement);
  }

  // 🛠 スタイルを<head>に追加する関数
  function addStyleToHead(styleContent) {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = styleContent;
    document.head.appendChild(styleElement);
  }
});

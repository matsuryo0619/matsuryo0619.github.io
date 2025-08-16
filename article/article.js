document.addEventListener('DOMContentLoaded', function() {
  // URLからdataを取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  // YAMLファイルを読み込む
  fetch('https://matsuryo0619.github.io/Article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      const pagesData = jsyaml.load(yamlData);
      const pagekey = `art${sitedata}`;
      const pageData = pagesData.pages[pagekey];
      const container = document.createElement('div');

      if (pageData && pageData.public) {
        const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>");

        container.id = 'content';
        container.innerHTML = `
          <h1 id="content_title">${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <div id="Rough_menu">${formattedContent}</div>
        `;
        document.title = `${pageData.title} - スゴスク!`;
        document.body.appendChild(container);

        if (pageData.action) addScriptToHead(pageData.action);
        if (pageData.style) addStyleToHead(pageData.style);

        // --- ここからMutationObserverで監視 ---
        const roughMenu = document.getElementById('Rough_menu');
        const observer = new MutationObserver((mutationsList, observer) => {
          // 変更があったらscratchblocksをレンダリング
          scratchblocks.renderMatching('.scratchblocks', { languages: ["ja"], style: "scratch3" });
        });

        observer.observe(roughMenu, {
          childList: true,   // 子ノードの追加/削除
          subtree: true,     // 子孫ノードも監視
          characterData: true // テキストの変更も監視
        });
        // 最初のレンダリングも実行
        scratchblocks.renderMatching('.scratchblocks', { languages: ["ja"], style: "scratch3" });
        // --- ここまで ---
      } else if (pageData && !pageData.public) {
        container.innerHTML = "<p>指定されたページは公開されていません</p>";
        document.body.appendChild(container);
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
        document.body.appendChild(container);
      }

      const PageFinish = new CustomEvent('PageFinish');
      document.dispatchEvent(PageFinish);
    })
    .catch(error => console.error('YAML読み込みエラー', error));

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

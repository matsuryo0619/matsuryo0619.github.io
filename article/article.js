document.addEventListener('DOMContentLoaded', function() {
  //URLからdataを取得
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');

  //ファイルを読み込む

  fetch('https://matsuryo0619.github.io/scratchblog/article.yaml')
    .then(response => response.text())
    .then(yamlData => {
      //YAMLをJAVASCRIPTオブジェクトへ
      const pagesData = jsyaml.load(yamlData);
      //動的にキーを作成
      const pagekey = `art${sitedata}`
      //取得したキーに対応するページを表示
      const pageData = pagesData.pages[pagekey];
      const container = document.createElement('div');

      const formattedContent = pageData.content.replace(/<(\w+)\st>/g, "<$1>");
      container.id = 'content';
      if(pageData) {
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p>${pageData.data}</p>
          <div>${formattedContent}</div>
        `
      } else {
        container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
      }
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

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

      if(pageData) {

      } else {

      }
    })
    .catch(error => console.error('YAML読み込みエラー', error));
});

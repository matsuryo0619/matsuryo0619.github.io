document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const sitedata = urlParams.get('data');
  const pagekey = `art${sitedata}`;
  const container = document.createElement('div');
  container.id = 'content';

  try {
    const response = await fetch('https://matsuryo0619.github.io/scratchblog/article.yaml');
    const yamlData = await response.text();
    const pagesData = jsyaml.load(yamlData);
    const pageData = pagesData.pages?.[pagekey];

    if (pageData) {
      if (pageData.public) {
        document.title = `${pageData.title} - スゴスク!`;
        container.innerHTML = `
          <h1>${pageData.title}</h1>
          <p class="date">${pageData.data}</p>
          <div>${pageData.content?.replace(/<(\w+)\st>/g, "<$1>") || ""}</div>
        `;
        if (pageData.action) addToHead('script', pageData.action);
        if (pageData.style) addToHead('style', pageData.style);
      } else {
        container.innerHTML = "<p>指定されたページは公開されていません</p>";
      }
    } else {
      container.innerHTML = "<p>指定されたページは見つかりませんでした。</p>";
    }
  } catch (error) {
    console.error('YAML読み込みエラー', error);
    container.innerHTML = "<p>記事データの取得に失敗しました。</p>";
  }

  document.body.appendChild(container);
  document.dispatchEvent(new CustomEvent('PageFinish'));

  function addToHead(tag, content) {
    const element = document.createElement(tag);
    element.textContent = content;
    document.head.appendChild(element);
  }
});

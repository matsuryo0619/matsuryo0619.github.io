const title = document.getElementById("title");

const options = {
  root: null, // ビューポート基準
  rootMargin: "0px 0px -30% 0px", // 30%オフセット
  threshold: 0.5 // 50%見えたら発火
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      title.classList.add("active"); // アニメーション開始
      observer.unobserve(title); // 1回だけ発火
    }
  });
};

// IntersectionObserverを作成して監視開始
const observer = new IntersectionObserver(callback, options);
observer.observe(title);

// アニメーション終了後に `span` をフェードイン
title.addEventListener("animationend", () => {
  document.querySelectorAll("#title span:not(.title_claim)").forEach(span => {
    span.style.display = "inline"; // `display: none` を解除
    span.style.opacity = "0"; // 最初は透明
    span.style.transition = "opacity 1.5s ease-out"; // 1.5秒かけてなめらかに表示

    // 少し時間を空けてからフェードイン開始
    setTimeout(() => {
      span.style.opacity = "1";
    }, 200); // 0.2秒待ってから徐々に表示
  });
});

async function getRecentArticles({ type = null, count = 5, yamlPath = 'Article.yaml' } = {}) {
  const response = await fetch(yamlPath);
  const yamlText = await response.text();
  const pagesData = jsyaml.load(yamlText);

  // 全ページからtypeとpublicをフィルター
  let filteredPages = Object.entries(pagesData.pages)
    .filter(([_, page]) => page.public && (!type || page.type === type))
    .map(([key, page]) => ({ key, ...page }));

  // 日付（data）で新しい順にソート
  filteredPages.sort((a, b) => new Date(b.data) - new Date(a.data));

  // 指定された件数だけ取得（count件 or それ未満）
  return filteredPages.slice(0, count);
}

const teaches = document.getElementById('teaches');
getRecentArticles({type: 'teach', count: 4}).then(pages => {
  pages.forEach((page, index) => {
    const div = document.createElement('div');
    div.style.opacity = 0;
    div.classList.add('teaches_site');
    
    const title = document.createElement('h3');
    title.classList.add('teaches_title');
    title.textContent = page.title;
    div.appendChild(title);
    teaches.appendChild(div);
    setTimeout(() => {
      div.style.opacity = 1;
    }, index * 100);
  });
});

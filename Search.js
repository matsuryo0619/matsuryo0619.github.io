document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('headerSearchCreated', function (event) {
    const searchInput = event.detail.searchInput;
    const urlParams = new URLSearchParams(window.location.search);
    const searchtext = urlParams.get('q');
    const searchtype = urlParams.get('type'); // OR or AND の検索タイプ
    const searchQuery = searchtext ? searchtext : '';
    const resultList = document.getElementById('searchResults');
    const tags = searchQuery.match(/#[^\s　#]+/g);
    const type = searchQuery.match(/@[^\s　@]+/g);
    console.log(`tags: ${tags}`);
    console.log(`type: ${type}`);
    searchInput.value = searchQuery;
    document.title = `${searchQuery} - スゴスク!`;

    async function fetchData() {
      let data = [];
      try {
        const response = await fetch('../sites.json');
        if (!response.ok) throw new Error('データ取得に失敗しました');

        data = await response.json();
        console.log(false, 'データ取得成功:', data);

        if (searchQuery) search(searchQuery, data, searchtype);
      } catch (error) {
        console.error(error);
        resultList.innerHTML = '<p>データを取得できませんでした</p>';
      }
    }

    function search(query, data, searchtype) {
  resultList.innerHTML = '';
  const keywords = splitSearchQuery(query);

  console.log(false, '🔍 検索ワード:', keywords);
  console.log(false, '🔍 検索タイプ（searchtype）:', searchtype);

  if (keywords.length === 0) {
    console.log(false, '⚠️ 検索ワードが空です');
    resultList.innerHTML = '<p>検索ワードを入力してください</p>';
    return;
  }

  const mode = searchtype.toLowerCase();
  console.log(false, '🔄 検索モード:', mode === 'or' ? 'OR検索' : 'AND検索');

  const filteredData = data.filter(item => {
    let matchedWords = []; // どのキーワードがヒットしたか記録するリスト

    const isMatch = keywords[mode === 'or' ? 'some' : 'every'](keyword => {
      let hitLocations = []; // どこにヒットしたか記録

      if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
        hitLocations.push('タイトル');
      }
      if (item.content.toLowerCase().includes(keyword.toLowerCase())) {
        hitLocations.push('内容');
      }
      if (item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) {
        hitLocations.push('タグ');
      }

      if (hitLocations.length > 0) {
        matchedWords.push(`"${keyword}"（${hitLocations.join(', ')}）`);
        return true; // このキーワードでマッチした
      }
      return false; // マッチしなかった
    });

    // **ログ出力**
    console.log(false, '📝 チェック中:', item.title, '| マッチ:', isMatch);
    if (matchedWords.length > 0) {
      console.log(false, '  ↳ ヒット:', matchedWords.join('、 '));
    }

    return isMatch;
  });

  console.log(false, '📌 フィルタ後のデータ:', filteredData);

  if (filteredData.length === 0) {
    console.log(false, '⚠️ 検索結果なし');
    resultList.innerHTML = '<p>結果が見つかりませんでした</p>';
    return;
  }

  filteredData.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('result-item');
    div.classList.add('border');
    const tags = (result.tags && result.tags.length > 0)
      ? result.tags.map(tag => `<a href="#" class="tag-link">${tag}</a>`).join(', ')
      : 'なし';

    div.innerHTML = `
      <h3><a href="../${result.url}" class="preview-link" data-important="true">${result.title}</a></h3>
      <p>${result.content}</p>
      <p><b>タグ:</b> ${tags}</p>
    `;

    resultList.appendChild(div);
  });

  setupTagClick();
}


    function matchesKeyword(item, keyword) {
      keyword = keyword.toLowerCase();
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    function setupTagClick() {
      document.querySelectorAll('.tag-link').forEach(tagElement => {
        if (!tagElement.hasAttribute('data-click-bound')) {
          tagElement.setAttribute('data-click-bound', 'true');
          tagElement.addEventListener('click', function (event) {
            event.preventDefault();
            const tag = event.target.textContent;
            window.location.href = `https://matsuryo0619.github.io/search/?q=${encodeURIComponent(tag)}&type=${searchtype}`;
          });
        }
      });
    }

    function splitSearchQuery(query) {
      return query.split(/\s+/).filter(keyword => keyword.trim() !== ''); // 空白で分割し、空文字を除外
    }

    function setupPreviewHover() {
      let previewTimeout;
      let iframe;

      document.querySelectorAll('.preview-link').forEach(link => {
        link.addEventListener('mouseenter', function (event) {
          const targetLink = event.target.href;
          const mouseX = event.clientX;
          const mouseY = event.clientY;

          previewTimeout = setTimeout(() => {
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.src = targetLink;
              iframe.style.position = 'fixed';
              iframe.style.width = '400px';
              iframe.style.height = '300px';
              iframe.style.border = '1px solid black';
              iframe.style.background = '#fff';
              iframe.style.boxShadow = '2px 2px 8px rgba(0, 0, 0, 0.3)';
              iframe.style.zIndex = '1000';
              iframe.style.left = `${mouseX + 10}px`;
              iframe.style.top = `${mouseY + 10}px`;

              document.body.appendChild(iframe);

              iframe.addEventListener('mouseenter', () => {
                clearTimeout(previewTimeout);
              });

              iframe.addEventListener('mouseleave', () => {
                if (iframe) {
                  iframe.remove();
                  iframe = null;
                }
              });
            }
          }, 1000); // 1秒の遅延
        });

        link.addEventListener('mouseleave', function () {
          clearTimeout(previewTimeout);
        });
      });
    }

    fetchData(); // データを取得して検索
  });
});

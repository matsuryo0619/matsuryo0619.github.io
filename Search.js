document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('headerSearchCreated', function (event) {
    const searchInput = event.detail.searchInput;
    const urlParams = new URLSearchParams(window.location.search);
    const searchtext = urlParams.get('q');
    const searchtype = urlParams.get('type'); // OR or AND の検索タイプ
    const searchQuery = searchtext ? decodeURIComponent(searchtext) : '';
    const resultList = document.getElementById('searchResults');
    searchInput.value = searchQuery;
    document.title = `${searchQuery} - スゴスク!`;

    async function fetchData() {
      let data = [];
      try {
        const response = await fetch('sites.json');
        if (!response.ok) throw new Error('データ取得に失敗しました');

        data = await response.json();
        console.log('データ取得成功:', data);

        if (searchQuery) search(searchQuery, data, searchtype);
      } catch (error) {
        console.error(error);
        resultList.innerHTML = '<p>データを取得できませんでした</p>';
      }
    }

    function search(query, data, searchtype) {
  resultList.innerHTML = '';
  const keywords = splitSearchQuery(query);

  console.log('🔍 検索ワード:', keywords);
  console.log('🔍 検索タイプ（searchtype）:', searchtype);  // searchtype の確認

  if (keywords.length === 0) {
    console.log('⚠️ 検索ワードが空です');
    resultList.innerHTML = '<p>検索ワードを入力してください</p>';
    return;
  }

  const useOrSearch = searchtype === 'or';

  console.log('🔄 検索モード:', useOrSearch ? 'OR検索' : 'AND検索'); // 検索モードが OR になっているか確認

  const filteredData = data.filter(item => {
    const match = useOrSearch
      ? keywords.some(keyword =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.content.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
        )
      : keywords.every(keyword =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.content.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
        );

    // **各アイテムのマッチ状態を表示**
    console.log('📝 チェック中:', item.title, '| マッチ:', match);

    return match;
  });

  console.log('📌 フィルタ後のデータ:', filteredData);

  if (filteredData.length === 0) {
    console.log('⚠️ 検索結果なし');
    resultList.innerHTML = '<p>結果が見つかりませんでした</p>';
    return;
  }

  filteredData.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('result-item');
    const tags = (result.tags && result.tags.length > 0)
      ? result.tags.map(tag => `<a href="#" class="tag-link">${tag}</a>`).join(', ')
      : 'なし';

    div.innerHTML = `
      <h3><a href="https://matsuryo0619.github.io/scratchblog/link.html?link=${encodeURIComponent(result.url)}" target="_blank" class="preview-link">${result.title}</a></h3>
      <p>${result.content}</p>
      <p><b>タグ:</b> ${tags}</p>
    `;

    resultList.appendChild(div);
  });

  setupPreviewHover();
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
            window.location.href = `https://matsuryo0619.github.io/scratchblog/Search.html?q=${encodeURIComponent(tag)}&type=${searchtype}`;
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

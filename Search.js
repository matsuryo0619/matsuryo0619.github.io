document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('headerSearchCreated', function (event) {
    const searchInput = event.detail.searchInput;
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
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

        if (searchQuery) search(searchQuery, data);
      } catch (error) {
        console.error(error);
        resultList.innerHTML = '<p>データを取得できませんでした</p>';
      }
    }

    function search(query, data) {
      resultList.innerHTML = '';
      if (!query.trim()) {
        resultList.innerHTML = '<p>検索ワードを入力してください</p>';
        return;
      }

      const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      if (filteredData.length === 0) {
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

    function setupTagClick() {
      document.querySelectorAll('.tag-link').forEach(tagElement => {
        tagElement.addEventListener('click', function (event) {
          event.preventDefault();
          const tag = event.target.textContent;
          window.location.href = `https://matsuryo0619.github.io/scratchblog/Search.html?q=${tag}`;
        });
      });
    }

    function setupPreviewHover() {
      let previewTimeout;
      let iframe;

      document.querySelectorAll('.preview-link').forEach(link => {
        link.addEventListener('mouseenter', function (event) {
          const targetLink = event.target.href;
          const mouseX = event.pageX;
          const mouseY = event.pageY;

          previewTimeout = setTimeout(() => {
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.src = targetLink;
              iframe.style.position = 'absolute';
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
          }, 3000);
        });

        link.addEventListener('mouseleave', function () {
          clearTimeout(previewTimeout);
        });
      });
    }

    fetchData(); // データを取得して検索
  });
});

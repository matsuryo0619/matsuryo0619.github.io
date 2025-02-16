document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('headerSearchCreated', function(event) {
    const searchInput = event.detail.searchInput;
    const searchQuery = sessionStorage.getItem('searchQuery') || '';
    const resultList = document.getElementById('searchResults');

    searchInput.value = searchQuery;
    let data = [];

    async function fetchData() {
      try {
        const response = await fetch('sites.json');
        if (!response.ok) throw new Error('データ取得に失敗しました');
        
        data = await response.json();
        console.log('データ取得成功:', data);

        if (searchQuery) search(searchQuery);
      } catch (error) {
        console.error(error);
        resultList.innerHTML = '<p>データを取得できませんでした</p>';
      }
    }

    function search(query) {
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
          <h3><a href="${result.url}" target="_blank" class="preview-link">${result.title}</a></h3>
          <p>${result.content}</p>
          <p><strong>タグ:</strong> ${tags}</p>
        `;

        resultList.appendChild(div);
      });

      setupPreviewHover(); // タイトルのホバーイベントを設定
      setupTagClick(); // タグのクリックイベントを設定
    }

    function setupTagClick() {
      document.querySelectorAll('.tag-link').forEach(tagElement => {
        tagElement.addEventListener('click', function(event) {
          event.preventDefault();
          const tag = event.target.textContent;
          sessionStorage.setItem('searchQuery', tag);
          window.location.href = 'Search.html';
        });
      });
    }

    function setupPreviewHover() {
      let previewTimeout;
      let iframe;

      document.querySelectorAll('.preview-link').forEach(link => {
        link.addEventListener('mouseenter', function(event) {
          previewTimeout = setTimeout(() => {
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.src = link.href;
              iframe.style.position = 'absolute';
              iframe.style.width = '400px';
              iframe.style.height = '300px';
              iframe.style.border = '1px solid black';
              iframe.style.background = '#fff';
              iframe.style.boxShadow = '2px 2px 8px rgba(0, 0, 0, 0.3)';
              iframe.style.pointerEvents = 'none'; // クリック不可
              document.body.appendChild(iframe);
            }

            // マウスの位置に基づいて iframe の位置を設定
            document.addEventListener('mousemove', moveIframe);
          }, 3000);
        });

        link.addEventListener('mouseleave', function() {
          clearTimeout(previewTimeout);
        });
      });

      function moveIframe(event) {
        if (iframe) {
          iframe.style.left = `${event.pageX + 10}px`;
          iframe.style.top = `${event.pageY + 10}px`;
        }
      }

      document.addEventListener('mouseleave', function() {
        if (iframe) {
          iframe.remove();
          iframe = null;
          document.removeEventListener('mousemove', moveIframe);
        }
      });
    }

    fetchData();
  });
});

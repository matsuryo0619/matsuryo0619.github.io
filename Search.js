document.addEventListener('DOMContentLoaded', function() {
// 1. 検索ワードを `sessionStorage` から取得
const searchQuery = sessionStorage.getItem('searchQuery') || '';
const searchInput = document.getElementById('header_Search');
const resultList = document.getElementById('searchResults');

// 2. 検索バーに `sessionStorage` の値をセット
searchInput.value = searchQuery;

// 3. データ変数を定義（fetch で JSON を取得するために必要）
let data = [];

// 4. JSON データを取得
async function fetchData() {
  try {
    const response = await fetch('sites.json');
    if (!response.ok) throw new Error('データ取得に失敗しました');
    
    data = await response.json(); // JSONデータを `data` に格納
    console.log('データ取得成功:', data);

    if (searchQuery) search(searchQuery); // 検索ワードがあれば自動検索
  } catch (error) {
    console.error(error);
    resultList.innerHTML = '<p>データを取得できませんでした</p>';
  }
}

// 5. 検索機能
function search(query) {
  resultList.innerHTML = ''; // 前回の検索結果をクリア

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

  // 検索結果を表示
  filteredData.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('result-item');

    div.innerHTML = `
      <h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
      <p>${result.content}</p>
      <p><strong>タグ:</strong> ${result.tags.join(', ')}</p>
    `;

    resultList.appendChild(div);
  });
}

// 6. JSON データを取得（fetchData を呼び出す）
fetchData();
});

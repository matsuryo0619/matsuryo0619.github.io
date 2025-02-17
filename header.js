// ヘッダーを作成
const header = document.createElement('header');
header.id = 'header';

// ヘッダーの子要素を作成
const Logo = document.createElement('img');
Logo.id = 'header_logo';
Logo.src = 'img/Logo.png';

const Search = document.createElement('input');
Search.type = 'text';
Search.id = 'header_Search';
Search.placeholder = 'サイト内検索';
Search.autocomplete = 'off';

// ボタンの親リスト
const Button_parent = document.createElement('ul');
Button_parent.style.listStyle = 'none';
Button_parent.id = 'header_buttonlist';

const ButtonList = [
  { text: 'ホーム', src: 'Home.html' },
  { text: '私の作品', src: 'myStuff.html' }
];

ButtonList.forEach((data) => {
  const Button = document.createElement('li');
  Button.classList.add('header_List');
  Button.textContent = data.text;
  Button_parent.appendChild(Button);

  Button.addEventListener('click', function () {
    if (data.src.includes('https://')) {
      window.location.href = data.src;
    } else {
      window.location.href = `https://matsuryo0619.github.io/scratchblog/${data.src}`;
    }
  });
});

// ヘッダーに子要素を追加
header.appendChild(Logo);
header.appendChild(Search);
header.appendChild(Button_parent);

// ヘッダーをHTMLに追加
document.body.appendChild(header);

//P要素を追加
const header_margin = document.createElement('p');
header_margin.textContent = 'ヘッダー間隔';
header_margin.id = 'header_margin';
document.body.prepend(header_margin);

// ヘッダーイベント
Logo.addEventListener('click', function () {
  window.location.href = 'Home.html';
});

// 検索バーにEnterが押された時の処理
Search.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const value = Search.value;
    if (value.trim().length > 0) {
      sessionStorage.setItem('searchQuery', value);  // 検索ワードを sessionStorage に保存
      window.location.href = 'Search.html';  // Search.html に遷移
    }
  }
});

// 検索バーが作成された後にカスタムイベントを発火
const event = new CustomEvent('headerSearchCreated', {
  detail: { searchInput: Search }  // `searchInput` 要素をイベントの詳細として渡す
});
window.dispatchEvent(event);  // カスタムイベントを発火

// URLパラメータ
const urlParams = new URLSearchParams(window.location.search);

// ヘッダーを作成
const header = document.createElement('header');
header.id = 'header';

// ヘッダーの子要素を作成
const Logo = document.createElement('img');
Logo.id = 'header_logo';
Logo.src = 'https://matsuryo0619.github.io/img/Logo.png';

// サイト内検索
const SearchDIV = document.createElement('div');
SearchDIV.id = 'SearchBOX';

// サイト内検索ボックス
const Search = document.createElement('input');
Search.type = 'text';
Search.id = 'header_Search';
Search.placeholder = 'サイト内検索';
Search.autocomplete = 'off';

// サイト内検索ボタン
const SearchBtn = document.createElement('i');
SearchBtn.classList.add('fa-solid', 'fa-magnifying-glass');
SearchBtn.id = 'header_SearchBtn';

// サイト内検索方法
const SearchForm = document.createElement('select');
SearchForm.id = 'header_option';

// サイト内検索方法オプション
const SearchForm_option = [
  { value: 'AND', text: 'すべて' },
  { value: 'OR', text: 'いずれか' }
];

SearchForm_option.forEach((item) => {
  const option = document.createElement('option');
  option.value = item.value;
  option.textContent = item.text;
  SearchForm.appendChild(option);
});

const Params_type = urlParams.get('type');

if (Params_type) {
  SearchForm.value = Params_type;
}

SearchDIV.appendChild(SearchBtn);
SearchDIV.appendChild(Search);
SearchDIV.appendChild(SearchForm);

//アカウント
export const accounts_parent = document.createElement('div');
accounts_parent.id = 'header_accountsParent';

const accounts_p = document.createElement('p');
accounts_p.textContent = 'アカウント';

const accounts_ul = document.createElement('div');
accounts_ul.id = 'header_accountsUl';

const accounts_li = [
  { text: "アカウント設定", id: "accounts_setting", onclick: () => {
    window.location = 'https://matsuryo0619.github.io/accounts?';
  } },
  { text: "ログアウト", id: "accounts_logout", onclick: () => {
    localStorage.removeItem('account');
    if (typeof secureAuth !== 'undefined') {
      secureAuth.clearAuthData()
    }
    window.location.replace('https://matsuryo0619.github.io');
  } }
]

accounts_li.forEach((item) => {
  const li = document.createElement('span');
  li.textContent = item.text;
  li.id = item.id;
  accounts_ul.appendChild(li);
  if (item.onclick && typeof item.onclick === 'function') li.onclick = item.onclick;
});

accounts_parent.appendChild(accounts_p);
accounts_parent.appendChild(accounts_ul);

// ボタンの親リスト
const Button_parent = document.createElement('ul');
Button_parent.style.listStyle = 'none';
Button_parent.id = 'header_buttonlist';

const ButtonList = [
  { text: 'ホーム', src: 'index.html' },
  { text: '私の作品', src: 'myStuff' },
  { text: 'アカウント作成', src: 'accounts?type=make' },
  { text: 'ログイン', src: 'accounts?type=login', id: 'header_Tologin' }
];

ButtonList.forEach((data) => {
  const Button = document.createElement('li');
  Button.classList.add('header_List');
  Button.id = data.id || `header_To${data.src.substring(0, data.src.indexOf('.'))}`
  Button.textContent = data.text;
  Button_parent.appendChild(Button);

  Button.addEventListener('click', function () {
    if (data.src.includes('https://')) {
      window.location.href = data.src;
    } else {
      window.location.href = `https://matsuryo0619.github.io/${data.src}`;
    }
  });
});

// ヘッダーに子要素を追加
header.appendChild(Logo);
header.appendChild(SearchDIV);
header.appendChild(Button_parent);
header.appendChild(accounts_parent);

// ヘッダーをHTMLに追加
document.body.appendChild(header);

// P要素を追加
const header_margin = document.createElement('p');
header_margin.textContent = 'ヘッダー間隔';
header_margin.id = 'header_margin';
document.body.prepend(header_margin);

// ヘッダーロゴのクリックイベント
Logo.addEventListener('click', function () {
  window.location.href = 'https://matsuryo0619.github.io';
});

// 検索URLを生成する関数
function SearchURL(value) {
  return `https://matsuryo0619.github.io/search/?q=${encodeURIComponent(value)}&type=${SearchForm.value}`;
}

// 検索バーにEnterが押された時の処理
Search.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const value = Search.value.trim();
    if (value.length > 0) {
      window.location.href = SearchURL(value);
    }
  }
});

// 検索ボタンが押されたときの処理
SearchBtn.addEventListener('click', function () {
  const value = Search.value.trim();
  if (value.length > 0) {
    window.location.href = SearchURL(value);
  }
});

// 検索方法が変更されたときの処理
SearchForm.addEventListener('change', () => {
  if (window.location.pathname === '/search/') {
    const value = Search.value.trim();
    urlParams.set('type', SearchForm.value);
    window.location.href = SearchURL(value);
  }
});

// 検索バーが作成された後にカスタムイベントを発火
const event = new CustomEvent('headerSearchCreated', {
  detail: { searchInput: Search }
});

window.dispatchEvent(event);

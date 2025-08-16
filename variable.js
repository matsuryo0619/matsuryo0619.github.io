// prefers-color-scheme を使って端末のテーマを判定
const mediaTheme = window.matchMedia('(prefers-color-scheme: dark)');

// 現在のテーマに応じて body に属性を付ける
function applyTheme(e) {
  if (e.matches) {
    // ダークモード
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    // ライトモード
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// 初回適用
applyTheme(mediaTheme);

// 端末テーマが変わったときのイベントを監視
mediaTheme.addEventListener('change', applyTheme);

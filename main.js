//ヘッダー･フッターが無い場合
setTimeout(function() {
    const header = document.getElementById('header');  
    const footer = document.getElementById('footer');  

    if (!header || !footer) {
        location.reload();
    }
}, 1000);

// 新しい rand を作成
let rand = Math.floor(Math.random() * 1000000);
rand = String(rand).padStart(6, '0');

// 現在のURLパラメータを取得
let urlParams = new URLSearchParams(window.location.search);

// `rand` を毎回更新
urlParams.set('rand', rand);
window.location.href = `${window.location.pathname}?${urlParams.toString()}`;

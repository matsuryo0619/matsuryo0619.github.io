//ヘッダー･フッターがなかった場合
setTimeout(function() {
    const header = document.getElementById('header');  // 例: IDがelement1の要素
    const footer = document.getElementById('footer');  // 例: IDがelement2の要素

    if (!header || !footer) {
      //どちらかがなかったらページをリロード
      location.reload();  
    }
}, 1000); // 1000ms = 1秒

//常にデータを更新させるように
let urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has('rand')) {
    let rand = Math.floor(Math.random() * 1000000);
    rand = String(rand).padStart(6, '0');
    urlParams.set('rand', rand); 
    window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

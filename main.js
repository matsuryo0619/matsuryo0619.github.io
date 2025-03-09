//ヘッダー･フッターが無い場合
setTimeout(function() {
    const header = document.getElementById('header');  
    const footer = document.getElementById('footer');  

    if (!header || !footer) {
        location.reload();
    }
}, 1000);

if (!window.location.search.includes('rand=')) {  
    let urlParams = new URLSearchParams(window.location.search); // `if` の中だけで宣言
    let rand = Math.floor(Math.random() * 1000000);
    rand = String(rand).padStart(6, '0');
    urlParams.set('rand', rand);
    window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

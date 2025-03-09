//ヘッダー･フッターがなかった場合
setTimeout(function() {
    const header = document.getElementById('header');  // 例: IDがelement1の要素
    const footer = document.getElementById('footer');  // 例: IDがelement2の要素

    if (!header || !footer) {
      //どちらかがなかったらページをリロード
      location.reload();  
    }
}, 1000); // 1000ms = 1秒

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

// window.openのオーバーライド
// window.openのオーバーライド（多重定義防止）
if (!window._isWindowOpenOverridden) {
  const originalOpen = window.open;
  window.open = function (url, windowName, windowFeatures) {
    console.log('開こうとしてるURL:', url);

    if (
      url &&
      !url.startsWith('https://matsuryo0619.github.io/scratchblog/') &&
      !url.startsWith('#') &&
      !url.startsWith('javascript:') &&
      !url.startsWith('mailto:') &&
      !url.startsWith('tel:')
    ) {
      url = `https://matsuryo0619.github.io/scratchblog/link.html?link=${encodeURIComponent(url)}`;
    }

    return originalOpen.call(this, url, windowName, windowFeatures);
  };
  window._isWindowOpenOverridden = true;
}

// MutationObserverでaタグのhref書き換え
const Link_observer = new MutationObserver(() => {
  document.querySelectorAll('a').forEach((a) => {
    const link = a.getAttribute('href');
    if (
      link &&
      !a.getAttribute('data-important') &&
      !a.dataset.rewritten &&
      !link.startsWith('https://matsuryo0619.github.io/scratchblog/') &&
      !link.startsWith('#') &&
      !link.startsWith('/') &&
      !link.startsWith('javascript:') &&
      !link.startsWith('mailto:') &&
      !link.startsWith('tel:')
    ) {
      a.href = `https://matsuryo0619.github.io/scratchblog/link.html?link=${encodeURIComponent(link)}&type=${linktype(a)}`;
      a.dataset.rewritten = 'true';
    }
  });
});

Link_observer.observe(document.body, {
  childList: true,
  subtree: true
});

function linktype(el) {
    return el.getAttribute('data-linktype') || 'normal';
}

document.addEventListener('authSystemReady', async () => {
  secureAuth.loadAuthData();
  const authResult = await secureAuth.quickAuthCheck();

  if (!authResult.isValid) {
    window.location.href = "accounts.html?type=login";
  } else {
    console.log("ログイン状態OK！");
  }
});

//ヘッダー･フッターが無い場合
setTimeout(function() {
    const header = document.getElementById('header');  
    const footer = document.getElementById('footer');  

    if (!header || !footer) {
        location.reload();
    }
}, 1000);

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
      !a.dataset.rewritten &&
      !link.startsWith('https://matsuryo0619.github.io/scratchblog/') &&
      !link.startsWith('#') &&
      !link.startsWith('javascript:') &&
      !link.startsWith('mailto:') &&
      !link.startsWith('tel:')
    ) {
      a.href = `https://matsuryo0619.github.io/scratchblog/link.html?link=${encodeURIComponent(link)}`;
      a.dataset.rewritten = 'true';
    }
  });
});

Link_observer.observe(document.body, {
  childList: true,
  subtree: true
});

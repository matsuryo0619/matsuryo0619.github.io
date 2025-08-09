//ヘッダー･フッターが無い場合
setTimeout(function() {
    const header = document.getElementById('header');  
    const footer = document.getElementById('footer');  

    if (!header || !footer) {
        location.reload();
    }
}, 1000);

// window.openのオーバーライド
// window.openのオーバーライド（多重定義防止）
if (!window._isWindowOpenOverridden) {
  const originalOpen = window.open;
  window.open = function (url, windowName, windowFeatures) {
    console.log(false, "開こうとしてるURL:", url);

    if (
      url &&
      !url.startsWith('https://matsuryo0619.github.io/') &&
      !url.startsWith('#') &&
      !url.startsWith('javascript:') &&
      !url.startsWith('mailto:') &&
      !url.startsWith('tel:')
    ) {
      url = `https://matsuryo0619.github.io/link?link=${encodeURIComponent(url)}`;
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
      !link.startsWith('https://matsuryo0619.github.io/') &&
      !link.startsWith('#') &&
      !link.startsWith('/') &&
      !link.startsWith('javascript:') &&
      !link.startsWith('mailto:') &&
      !link.startsWith('tel:')
    ) {
      a.href = `https://matsuryo0619.github.io/link?link=${encodeURIComponent(link)}&type=${linktype(a)}`;
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

const path = window.location.pathname;
const isAccountPage = path.includes('accounts');

async function checkAuth() {
  const authResult = await secureAuth.quickAuthCheck();
  if (!authResult.isValid) {
  } else {
    console.log(false, "ログイン状態OK！ ユーザー名:", authResult.username);
  }
}

if (window.secureAuth) {
    checkAuth();
}
window.addEventListener('authSystemReady', checkAuth);

const Titleobserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    // 属性の変化を監視
    if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
      const target = mutation.target;
      if (target.title) {
        target.dataset.title = target.title;
      } else {
        delete target.dataset.title;
      }
    }

    // 新しく追加されたノードも監視したいなら
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          // そのノード自身にtitleがあればセット
          if (node.title) {
            node.dataset.title = node.title;
          }
          // さらに子孫にtitleがあれば同様に処理
          node.querySelectorAll('[title]').forEach(el => {
            el.dataset.title = el.title;
          });
        }
      });
    }
  });
});

Titleobserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['title'],
  subtree: true,
  childList: true,
});

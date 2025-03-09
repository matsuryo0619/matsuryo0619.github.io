const title = document.getElementById('title');

// 中央付近に来たときに反応するためにrootMarginで調整
const options = {
  root: null,  // ビューポートを基準
  rootMargin: '0px 0px -50% 0px',  // 下方向に50%オフセットを追加（中央付近で反応）
  threshold: 0.5  // 要素が50%画面に入ったときに発火
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      title.classList.add('active');  // 画面の中央付近に来たらアクティブクラスを追加
    } else {
      title.classList.remove('active');  // 画面外に出たらクラスを削除
    }
  });
};

// IntersectionObserverを作成
const observer = new IntersectionObserver(callback, options);

// ターゲットを監視
observer.observe(title);

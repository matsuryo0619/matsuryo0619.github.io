const title = document.getElementById("title");

const options = {
  root: null, // ビューポート基準
  rootMargin: "0px 0px -30% 0px", // 30%オフセット
  threshold: 0.5 // 50%見えたら発火
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      title.classList.add("active"); // アニメーション開始
      observer.unobserve(title); // 1回だけ発火
    }
  });
};

// IntersectionObserverを作成して監視開始
const observer = new IntersectionObserver(callback, options);
observer.observe(title);

// アニメーション終了後に `span` をフェードイン
title.addEventListener("animationend", () => {
  document.querySelectorAll("#title span:not(.title_claim)").forEach(span => {
    span.style.display = "inline"; // `display: none` を解除
    span.style.opacity = "0"; // 透明な状態で表示
    span.style.transition = "opacity 0.5s ease-in-out"; // なめらかに表示
    requestAnimationFrame(() => {
      span.style.opacity = "1"; // フェードイン
    });
  });
});

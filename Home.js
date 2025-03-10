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

// アニメーション終了後に `span` をフェードイン＆ `.title_claim` を滑らかに戻す
title.addEventListener("animationend", () => {
  document.querySelector(".title_claim").classList.add("space"); // 文字間を元に戻す

  document.querySelectorAll("#title span:not(.title_claim)").forEach(span => {
    setTimeout(() => {
      span.style.opacity = "1"; // フェードイン
      span.style.transform = "translateY(0)"; // 上にスライド
    }, 200); // 0.2秒遅れて開始
  });
});

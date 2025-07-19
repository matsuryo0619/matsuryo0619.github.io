const menu = document.createElement("div");
menu.id = "context";
menu.classList.add("border");
menu.style.position = "fixed";
menu.style.minWidth = "200px";
menu.style.backgroundColor = "white";
menu.style.display = "none";
menu.style.zIndex = 9999;
menu.style.padding = "5px";

document.body.appendChild(menu);

// ★ 常に表示されるメニュー
const menus = [
  {
    type: 'parent',
    text: 'サイト',
    children: [
      {
        type: 'btn',
        text: 'リンクを保存',
        onclick: () => {
          if (!navigator.clipboard) {
            console.log('クリップボードに対応していません');
            return;
          }
          navigator.clipboard.writeText(window.location.href).then(
            () => {
              console.log('コピー完了');
            },
            () => {
              console.log('コピーできませんでした');
            }
          );
        }
      },
      {
        type: 'btn',
        text: '再読み込み',
        onclick: () => {
          window.location.reload();
        }
      }
    ]
  },
  { type: 'btn', text: 'フィードバック', onclick: () => { window.location.href = 'https://matsuryo0619.github.io/scratchblog/feedback.html'; } }
];

const conditionalMenus = [
  {
    condition: () => window.getSelection().toString().trim().length > 0,
    item: {
      type: 'parent',
      text: '選択したテキストを操作',
      children: [
        {
          type: 'parent',
          text: '検索',
          children: [
            {
              type: 'btn',
              text: 'スゴスク!',
              onclick: () => {
                console.log(SelectedText);
                if (SelectedText.length === 0) return;
                const query = encodeURIComponent(SelectedText);
                window.location.href = `https://matsuryo0619.github.io/scratchblog/Search.html?q=${query}&type=AND`;
              }
            },
            {
              type: 'btn',
              text: 'Google',
              onclick: () => {
                console.log(SelectedText);
                if (SelectedText.length === 0) return;
                const query = encodeURIComponent(SelectedText);
                window.open(`https://google.com/search?q=${query}`);
              }
            },
            {
              type: 'btn',
              text: 'Yahoo!',
              onclick: () => {
                console.log(SelectedText);
                if (SelectedText.length === 0) return;
                const query = encodeURIComponent(SelectedText);
                window.open(`https://search.yahoo.co.jp/search?p=${query}`);
              }
            },
            {
              type: 'btn',
              text: 'Bing',
              onclick: () => {
                console.log(SelectedText);
                if (SelectedText.length === 0) return;
                const query = encodeURIComponent(SelectedText);
                window.open(`https://www.bing.com/search?q=${query}`);
              }
            }
          ]
        },
        {
          type: 'btn',
          text: 'コピー',
          onclick: () => {
            console.log(SelectedText);
            if (SelectedText.length === 0) return;
            navigator.clipboard.writeText(SelectedText).then(
              () => {
                console.log('コピー完了');
              },
              () => {
                console.log('コピーできませんでした');
              }
            );
          }
        }
      ]
    }
  },
  {
    condition: () => {
      const el = document.activeElement;
      return (
        el.tagName === 'TEXTAREA' ||
        (el.tagName === 'INPUT' && el.type === 'text')
      );
    },
    item: {
      type: 'btn',
      text: '貼り付け',
      onclick: async () => {
        const el = document.activeElement;
        try {
          const text = await navigator.clipboard.readText();
          el.innerText += text;
          console.log('貼り付けました');
        } catch (err) {
          console.log('読み取れませんでした');
        }
      }
    }
  }
];


function buildMenu(container, items) {
  container.innerHTML = "";
  container.classList.add('border');

  items.forEach((item) => {
    if (item.type === "btn") {
      const btn = document.createElement("div");
      btn.textContent = item.text;
      btn.style.padding = "8px";
      btn.style.cursor = "pointer";
      btn.onclick = (e) => {
        e.stopPropagation();
        item.onclick();
        menu.style.display = "none";
      };
      container.appendChild(btn);
    } else if (item.type === "parent") {
      const parentDiv = document.createElement("div");
      parentDiv.textContent = item.text + " ▶";
      parentDiv.style.padding = "8px";
      parentDiv.style.cursor = 'default'; // 親メニュー項目にマウスを合わせた時のカーソル
      parentDiv.style.position = "relative";

      const subMenu = document.createElement("div");
      subMenu.style.position = "absolute";
      subMenu.style.top = "0"; // 初期値は0
      subMenu.style.left = "100%"; // 初期値は右側
      subMenu.style.minWidth = "155px";
      subMenu.style.backgroundColor = "white";
      subMenu.style.display = "none";
      subMenu.style.zIndex = 10000;

      buildMenu(subMenu, item.children);

      parentDiv.appendChild(subMenu);

      parentDiv.onmouseenter = () => {
        subMenu.style.display = "block";

        // サブメニューのサイズ、親メニューの位置、ビューポートのサイズを取得
        const subMenuWidth = subMenu.offsetWidth;
        const subMenuHeight = subMenu.offsetHeight;
        const parentRect = parentDiv.getBoundingClientRect(); // 親メニューの位置とサイズ
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // X軸方向の調整 (サブメニューが画面右からはみ出すか)
        if (parentRect.right + subMenuWidth > viewportWidth) {
          // はみ出す場合、親メニューの左側に表示
          subMenu.style.left = `-${subMenuWidth}px`;
        } else {
          // はみ出さない場合、通常通り親メニューの右側に表示
          subMenu.style.left = "100%";
        }

        // Y軸方向の調整 (サブメニューが画面下からはみ出すか)
        if (parentRect.top + subMenuHeight > viewportHeight) {
          // はみ出す場合、上方向に調整して画面内に収める
          // ただし、親メニューの上端より上にいかないようにする
          let newTop = viewportHeight - subMenuHeight - parentRect.top - 5; // 画面下端から5px余裕を持たせる
          if (newTop < -parentRect.top) { // 画面上端より上にはみ出さないように
             newTop = -parentRect.top + 5; // 画面上端から5px余裕を持たせる
          }
          subMenu.style.top = `${newTop}px`;
        } else {
          // はみ出さない場合、通常通り親要素の上端に合わせる
          subMenu.style.top = "0";
        }
      };

      parentDiv.onmouseleave = () => {
        subMenu.style.display = "none";
      };

      container.appendChild(parentDiv);
    }
  });
}

document.oncontextmenu = () => false; // デフォルトの右クリックメニューを無効化

let SelectedText; // 選択されたテキストを保持する変数

document.addEventListener("contextmenu", (event) => {
  SelectedText = window.getSelection().toString().trim(); // 選択テキストを取得
  event.preventDefault(); // デフォルトのイベント（ブラウザメニュー表示）をキャンセル

  // 表示するメニュー項目を決定 (固定メニュー + 条件付きメニュー)
  const itemsToShow = [...menus];
  conditionalMenus.forEach(({ condition, item }) => {
    try {
      if (condition()) {
        itemsToShow.push(item);
      }
    } catch (e) {
      console.warn("条件エラー:", e);
    }
  });

  buildMenu(menu, itemsToShow); // メニューを構築

  // --- メインメニューの表示位置調整 ---
  const menuWidth = menu.offsetWidth;  // メニューの幅を取得
  const menuHeight = menu.offsetHeight; // メニューの高さを取得

  const viewportWidth = window.innerWidth;    // ビューポート（画面）の幅
  const viewportHeight = window.innerHeight;  // ビューポート（画面）の高さ

  let posX = event.clientX; // クリックされたX座標
  let posY = event.clientY; // クリックされたY座標

  // X軸方向の調整 (メインメニューが画面右からはみ出すか)
  if (posX + menuWidth > viewportWidth) {
    posX = viewportWidth - menuWidth - 5; // 画面右端から少し（5px）内側に表示
  }
  // X軸方向の調整 (メインメニューが画面左からはみ出すか)
  if (posX < 0) {
    posX = 5; // 画面左端から少し（5px）内側に表示
  }

  // Y軸方向の調整 (メインメニューが画面下からはみ出すか)
  if (posY + menuHeight > viewportHeight) {
    posY = viewportHeight - menuHeight - 5; // 画面下端から少し（5px）内側に表示
  }
  // Y軸方向の調整 (メインメニューが画面上からはみ出すか)
  if (posY < 0) {
    posY = 5; // 画面上端から少し（5px）内側に表示
  }

  menu.style.left = `${posX}px`; // 調整されたX座標を設定
  menu.style.top = `${posY}px`;  // 調整されたY座標を設定
  menu.style.display = "block";  // メニューを表示
});

document.addEventListener("click", (event) => {
  // メニュー要素、またはその子孫要素がクリックされた場合はメニューを閉じない
  if (!menu.contains(event.target)) {
    menu.style.display = "none";
  }
});

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
    text: 'リンク',
    children: [
      {
        type: 'btn',
        text: 'このサイトのリンクを保存',
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
      }
    ]
  }
];

// ★ 条件付きメニュー（表示条件に合えば追加される）
const conditionalMenus = [
  {
    condition: () => window.getSelection().toString().trim().length > 0,
    item: {
      type: 'btn',
      text: '選択したテキストを検索...',
      onclick: () => {
        if(selectedText.length === 0) return;
        const query = encodeURIComponent(selectedText);
        window.location.href = `https://matsuryo0619.github.io/scratchblog/Search.html?q=${query}&type=AND`;
      }
    }
  },
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
      parentDiv.style.cursor = "pointer";
      parentDiv.style.position = "relative";

      const subMenu = document.createElement("div");
      subMenu.style.position = "absolute";
      subMenu.style.top = "0";
      subMenu.style.left = "100%";
      subMenu.style.minWidth = "150px";
      subMenu.style.backgroundColor = "white";
      subMenu.style.display = "none";
      subMenu.style.zIndex = 10000;

      buildMenu(subMenu, item.children);

      parentDiv.appendChild(subMenu);

      parentDiv.onmouseenter = () => {
        subMenu.style.display = "block";
      };
      parentDiv.onmouseleave = () => {
        subMenu.style.display = "none";
      };

      container.appendChild(parentDiv);
    }
  });
}

document.oncontextmenu = () => false;

let SelectedText;

document.addEventListener("contextmenu", (event) => {
  SelectedText = window.getSelection().toString().trim();
  event.preventDefault();

  // メニュー構成: 固定メニュー + 条件付きメニューの中で条件を満たすやつ
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

  buildMenu(menu, itemsToShow);

  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  menu.style.display = "block";
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) {
    menu.style.display = "none";
  }
});

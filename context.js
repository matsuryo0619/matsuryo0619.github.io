const menu = document.createElement("div");
menu.id = "context";
menu.classList.add("border");
menu.style.position = "absolute";
menu.style.minWidth = "200px";
menu.style.backgroundColor = "white";
menu.style.display = "none";
menu.style.zIndex = 9999;
menu.style.padding = "5px";

document.body.appendChild(menu);

// ✅ メニューを関数で返す
function menus() {
  const selection = window.getSelection().toString();

  if (selection) {
    // 選択文字あり用のメニュー
    return [
      {
        type: "btn",
        text: `「${selection}」をコピー`,
        onclick: () => {
          navigator.clipboard.writeText(selection).then(
            () => {
              console.log("コピー完了！");
            },
            () => {
              console.log("コピー失敗...");
            }
          );
        },
      },
    ];
  } else {
    // 通常メニュー
    return [
      {
        type: "parent",
        text: "リンク",
        children: [
          {
            type: "btn",
            text: "このサイトのリンクを保存",
            onclick: () => {
              if (!navigator.clipboard) {
                console.log("クリップボードに対応していません");
                return;
              }

              navigator.clipboard.writeText(window.location.href).then(
                () => {
                  console.log("コピー完了");
                },
                () => {
                  console.log("コピーできませんでした");
                }
              );
            },
          },
        ],
      },
    ];
  }
}

function buildMenu(container, items) {
  container.innerHTML = ""; // 中身クリア
  container.classList.add("border");

  items.forEach((item) => {
    if (item.type === "btn") {
      const btn = document.createElement("div");
      btn.textContent = item.text;
      btn.style.padding = "8px";
      btn.style.cursor = "pointer";
      btn.style.borderBottom = "1px solid #ddd";
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

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  const menuItems = menus(); // 選択状態によってメニューを決定！
  buildMenu(menu, menuItems);

  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  menu.style.display = "block";
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) {
    menu.style.display = "none";
  }
});

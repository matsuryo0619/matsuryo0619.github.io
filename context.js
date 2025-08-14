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

let lastFocusedElement = null;
document.addEventListener("mousedown", (e) => {
  lastFocusedElement = document.activeElement;
});

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
            console.log(false, 'クリップボードに対応していません');
            return;
          }
          navigator.clipboard.writeText(window.location.href).then(
            () => console.log(true, 'コピー完了'),
            () => console.log(true, 'コピーできませんでした')
          );
        }
      },
      {
        type: 'btn',
        text: '再読み込み',
        onclick: () => window.location.reload()
      }
    ]
  },
  {
    type: 'btn',
    text: 'フィードバック',
    onclick: () => {
      window.location.href = 'https://matsuryo0619.github.io/feedback';
    }
  }
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
                const query = encodeURIComponent(SelectedText);
                if (!query) return;
                window.location.href = `https://matsuryo0619.github.io/search?q=${query}&type=AND`;
              }
            },
            {
              type: 'btn',
              text: 'Scratch',
              onclick: () => {
                const query = encodeURIComponent(SelectedText);
                if (!query) return;
                window.open(`https://scratch.mit.edu/search/projects?q=${query}`);
              }
            },
            {
              type: 'parent',
              text: 'Google',
              children: [
                {
                  type: 'btn',
                  text: 'Google',
                  onclick: () => {
                    const query = encodeURIComponent(SelectedText);
                    if (!query) return;
                    window.open(`https://google.com/search?q=${query}`);
                  }
                },
                {
                  type: 'btn',
                  text: 'Youtube',
                  onclick: () => {
                    const query = encodeURIComponent(SelectedText);
                    if (!query) return;
                    window.open(`https://www.youtube.com/results?search_query=${query}`);
                  }
                }
              ]
            },
            {
              type: 'btn',
              text: 'Yahoo!',
              onclick: () => {
                const query = encodeURIComponent(SelectedText);
                if (!query) return;
                window.open(`https://search.yahoo.co.jp/search?p=${query}`);
              }
            },
            {
              type: 'btn',
              text: 'Bing',
              onclick: () => {
                const query = encodeURIComponent(SelectedText);
                if (!query) return;
                window.open(`https://www.bing.com/search?q=${query}`);
              }
            }
          ]
        },
        {
          type: 'btn',
          text: 'コピー',
          onclick: () => {
            if (!SelectedText) return;
            navigator.clipboard.writeText(SelectedText).then(
              () => console.log(true, 'コピー完了'),
              () => console.log(true, 'コピーできませんでした')
            );
          }
        }
      ]
    }
  },
  {
    condition: () => {
      return (
        lastFocusedElement &&
        (lastFocusedElement.tagName === 'TEXTAREA' ||
          (lastFocusedElement.tagName === 'INPUT' && lastFocusedElement.type === 'text'))
      );
    },
    item: {
      type: 'btn',
      text: '貼り付け',
      onclick: async () => {
        try {
          const text = await navigator.clipboard.readText();
          lastFocusedElement.value += text;
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
      parentDiv.style.cursor = 'default';
      parentDiv.style.position = "relative";

      const subMenu = document.createElement("div");
      subMenu.style.position = "absolute";
      subMenu.style.top = "0";
      subMenu.style.left = "100%";
      subMenu.style.minWidth = "155px";
      subMenu.style.backgroundColor = "white";
      subMenu.style.display = "none";
      subMenu.style.zIndex = 10000;

      buildMenu(subMenu, item.children);
      parentDiv.appendChild(subMenu);

      parentDiv.onmouseenter = () => {
        subMenu.style.display = "block";
        const subMenuWidth = subMenu.offsetWidth;
        const subMenuHeight = subMenu.offsetHeight;
        const parentRect = parentDiv.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (parentRect.right + subMenuWidth > viewportWidth) {
          subMenu.style.left = `-${subMenuWidth}px`;
        } else {
          subMenu.style.left = "100%";
        }

        if (parentRect.top + subMenuHeight > viewportHeight) {
          let newTop = viewportHeight - subMenuHeight - parentRect.top - 5;
          if (newTop < -parentRect.top) {
            newTop = -parentRect.top + 5;
          }
          subMenu.style.top = `${newTop}px`;
        } else {
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

document.oncontextmenu = () => false;

let SelectedText;

document.addEventListener("contextmenu", (event) => {
  SelectedText = window.getSelection().toString().trim();
  event.preventDefault();

  const itemsToShow = [...menus];
  conditionalMenus.forEach(({ condition, item }) => {
    try {
      if (condition()) itemsToShow.push(item);
    } catch (e) {
      console.warn("条件エラー:", e);
    }
  });

  buildMenu(menu, itemsToShow);

  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let posX = event.clientX;
  let posY = event.clientY;

  if (posX + menuWidth > viewportWidth) posX = viewportWidth - menuWidth - 5;
  if (posX < 0) posX = 5;
  if (posY + menuHeight > viewportHeight) posY = viewportHeight - menuHeight - 5;
  if (posY < 0) posY = 5;

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
  menu.style.display = "block";
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) {
    menu.style.display = "none";
  }
});

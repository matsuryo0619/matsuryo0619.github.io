const menu = document.createElement('div');
menu.id = 'context';
menu.classList.add('border');
menu.style.position = 'absolute';
menu.style.width = '200px';
menu.style.height = '300px';
menu.style.display = 'none';

document.body.appendChild(menu);

// 右クリックのブラウザメニューを消す
document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // これも入れとくと安心

  if (menu.contains(event.target)) {
    // メニューの中を右クリックしたら位置変えて表示
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.style.display = 'block';
  } else {
    // メニュー外を右クリックしたら非表示
    menu.style.display = 'none';
  }
});

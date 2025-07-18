const menu = document.createElement('div');
menu.id = 'context';
menu.classList.add('border');
menu.style.position = 'absolute';
menu.style.width = '200px';
menu.style.height = '300px';
menu.style.display = 'none';

const menus = [
  {type: 'btn', text: ''}
];

document.body.appendChild(menu);

document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
  if (menu.contains(event.target)) {
    const MouseX = event.clientX;
    const MouseY = event.clientY;
  
    menu.style.left = `${MouseX}px`;
    menu.style.top = `${MouseY}px`
    menu.style.display = 'block';
  }
});

document.addEventListener('contextmenu', (event) => {
  if (!menu.contains(event.target)) {
    menu.style.display = 'none';
  }
});

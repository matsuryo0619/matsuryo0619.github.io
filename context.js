const menu = document.createElement('div');
menu.id = 'context';
menu.classList.add('border');
menu.style.position = 'absolute';
menu.style.width = '50px';
menu.style.height = '100px';

const menus = [
  {type: 'btn', text: ''}
];

document.body.appendChild(menu);

document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
});

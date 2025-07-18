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
  menu.style.display = '';
});

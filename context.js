const menu = document.createElement('div');
menu.id = 'context';
menu.classList.add('border');

const menus = [
  {type: 'btn', text: ''}
];

document.body.appendChild(menu);

document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
});

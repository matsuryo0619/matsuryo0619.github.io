const menu = document.createElement('div');
menu.id = 'context';

const menus = [
  {type: 'btn', text: ''}
];

document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
});

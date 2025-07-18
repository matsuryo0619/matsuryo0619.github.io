const menu = document.createElement('div');
menu.id = 'context';

document.oncontextmenu = function () {
  return false;
};

document.addEventListener('contextmenu', (event) => {
});

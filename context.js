const menu = document.createElement('div');
menu.id = 'context';
menu.classList.add('border');
menu.style.position = 'absolute';
menu.style.width = '200px';
menu.style.height = '300px';
menu.style.display = 'none';

document.body.appendChild(menu);

document.oncontextmenu = () => false;

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  menu.style.display = 'block';
});

document.addEventListener('click', (event) => {
  if (!menu.contains(event.target)) {
    menu.style.display = 'none';
  }
});

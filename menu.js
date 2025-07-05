document.addEventListener('PageFinish', function() {
  const index = document.createElement('div');
  index.id = 'index';
  index.style.position = 'absolute';
  index.style.cursor = 'move';
  document.body.appendChild(index);
  const indextitle = document.createElement('p');
  indextitle.textContent = '目次';
  index.appendChild(indextitle);

  const classMenus = document.querySelectorAll('.Mainmenu');

  classMenus.forEach(function(data, i) {
    const indexMenu = document.createElement('p');
    indexMenu.textContent = data.getAttribute('data-ml') || `メニュー${i + 1}`;
    indexMenu.classList.add('indexMenu');
    indexMenu.addEventListener('click', function() {
      const rect = data.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 25,
        behavior: 'smooth'
      });
    });
    index.appendChild(indexMenu);
  });

  document.documentElement.style.scrollBehavior = 'smooth';
});

document.addEventListener('PageFinish', function() {
  const index = document.createElement('div');
  index.id = 'index';
  document.body.appendChild(index);

  const classMenus = document.querySelectorAll('#content > .Mainmenu');

  classMenus.forEach(function(data, i) {
    const indexMenu = document.createElement('p');
    indexMenu.textContent = data.getAttribute('data-ml') || `目次${i + 1}`;
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

document.addEventListener('PageFinish', function() {
  const index = document.createElement('nav');
  index.id = 'index';
  index.style.position = 'fixed';
  index.style.top = '10%';
  index.style.left = '10%';
  index.style.cursor = 'move';
  index.style.userSelect = 'none'; // テキスト選択を防ぐ
  index.style.zIndex = '1000'; // 他の要素より前面に表示
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
  
  // ドラッグ機能を追加
  makeDraggable(index);
});

// ドラッグ機能の実装
function makeDraggable(element) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  
  // マウスダウン時の処理
  element.addEventListener('mousedown', function(e) {
    // クリックされた要素がindexMenuの場合はドラッグを開始しない
    if (e.target.classList.contains('indexMenu')) {
      return;
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    // 現在の位置を取得
    const rect = element.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    // マウス移動とマウスアップのイベントリスナーを追加
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // テキスト選択を防ぐ
    e.preventDefault();
  });
  
  // タッチスタート時の処理（モバイル対応）
  element.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('indexMenu')) {
      return;
    }
    
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = element.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    document.addEventListener('touchmove', handleTouchMove, {passive: false});
    document.addEventListener('touchend', handleTouchEnd);
    
    e.preventDefault();
  });
  
  // マウス移動時の処理
  function handleMouseMove(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    updatePosition(deltaX, deltaY);
  }
  
  // タッチ移動時の処理
  function handleTouchMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    updatePosition(deltaX, deltaY);
  }
  
  // 位置を更新
  function updatePosition(deltaX, deltaY) {
    let newX = initialX + deltaX;
    let newY = initialY + deltaY;
    
    // 画面内に制限
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementRect = element.getBoundingClientRect();
    
    newX = Math.max(0, Math.min(newX, windowWidth - elementRect.width));
    newY = Math.max(0, Math.min(newY, windowHeight - elementRect.height));
    
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
  }
  
  // マウスアップ時の処理
  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
  
  // タッチエンド時の処理
  function handleTouchEnd() {
    isDragging = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }
}

//フッターの親要素を作成
const footer = document.createElement('footer');
footer.id = 'footer';

//フッターメニュー

//フッター矢印 - 上
const footer_uparrow = document.createElement('i');
footer_uparrow.classList.add('fa-regular');
footer_uparrow.classList.add('fa-square-caret-up');
footer_uparrow.id = 'footer_uparrow';
//フッター矢印 - 下
const footer_downarrow = document.createElement('i');
footer_downarrow.classList.add('fa-regular');
footer_downarrow.classList.add('fa-square-caret-down');
footer_downarrow.id = 'footer_downarrow';

//フッターにメニューを追加
footer.appendChild(footer_uparrow);
footer.appendChild(footer_downarrow);

//フッターを追加
document.body.appendChild(footer);

//フッター処理系
footer.addEventListener('mouseenter', () => {
  footer_uparrow.style.opacity = '0';
  footer_downarrow.style.opacity = '1';
});

footer.addEventListener('mouseleave', () => {
  footer_uparrow.style.opacity = '1';
  footer_downarrow.style.opacity = '0';
});

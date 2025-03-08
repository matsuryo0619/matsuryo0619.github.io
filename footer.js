//フッターの親要素を作成
const footer = document.createElement('footer');
footer.id = 'footer';

//フッターメニュー

//フッター矢印 - 上
const footer_uparrow = document.createElement('i');
footer_uparrow.classList.add('fa-regular');
footer_uparrow.classList.add('fa-square-caret-up');
footer_uparrow.id = 'footer_uparrow';

//フッターにメニューを追加
footer.appendChild(footer_uparrow);

//フッターを追加
document.body.appendChild(footer);

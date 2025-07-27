//フッターの親要素を作成
const footer = document.createElement('footer');
footer.id = 'footer';

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

//フッターメニュー
const footer_menu = document.createElement('div');
footer_menu.id = 'footer_menu';

//コメント機能クレジット表示
const Comment_Credit = document.createElement('a');
Comment_Credit.href = 'https://oilabo.vercel.app/blog/2021/static-website-commenting/#google_vignette'
Comment_Credit.textContent = 'コメント機能';
Comment_Credit.target = '_blank';

//フッターメニューを追加
footer_menu.appendChild(Comment_Credit);

//フッターにメニューを追加
footer.appendChild(footer_uparrow);
footer.appendChild(footer_downarrow);
footer.appendChild(footer_menu);

//フッターを追加
document.body.appendChild(footer);

//フッター処理系
footer.addEventListener('mouseover', () => {
  footer_uparrow.style.opacity = '0';
  footer_downarrow.style.opacity = '1';
});

footer.addEventListener('mouseout', () => {
  footer_uparrow.style.opacity = '1';
  footer_downarrow.style.opacity = '0';
});

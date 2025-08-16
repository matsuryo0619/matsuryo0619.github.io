const mediatheme = window.matchMedia('(prefers-color-scheme: dark)');
mediatheme.addEventListener('change', e => {
  if (e.matches) {
    console.log('ダークモードに変更されました');
  } else {
    console.log('ライトモードに変更されました');
  }
});

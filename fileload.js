//ファイル名のみ記述(.cssや.jsは省く)
const reqcss = ['main'];
const reqjs =[
  {src: 'header', defer: true}
]

//CSSを読み込む
reqcss.forEach((word) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${word}.css`;
  document.head.appendChild(link);
});

//JSを読み込む
reqjs.forEach((file) => {
  const script = document.createElement('script');
  script.src = `${file.src}.js`;
  if (file.defer) {
    script.defer = true;
  }
  document.head.appendChild(script);
});

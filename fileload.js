// CSSファイルと外部リンクのリスト
const reqcss = [
  'main', 
  'header', 
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap', 
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'footer',
  'border'
];

// JSファイルのリスト
const reqjs = [
  {src: 'header', defer: true},
  {src: 'context', defer: true},
  {src: 'footer', defer: true},
  {src: 'main', defer: false},
  {src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js', defer: true},
  {src: 'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js', defer: true}
];

// CSSを読み込む
reqcss.forEach((word) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';

  // URLがフルパスで指定されているか、相対パスで指定されているかを判別
  if (word.startsWith('http')) {
    link.href = word;
  } else {
    link.href = `https://matsuryo0619.github.io/scratchblog/${word}.css`;
  }
  
  document.head.appendChild(link);
});

// JSを読み込む
reqjs.forEach((file) => {
  const script = document.createElement('script');
  
  // JSファイルのパスを設定
  if (file.src.startsWith('http')) {
    script.src = file.src;
  } else {
    script.src = `https://matsuryo0619.github.io/scratchblog/${file.src}.js`;
  }

  if (file.defer) {
    script.defer = true;
  }
  document.head.appendChild(script);
});

// サイトアイコンを設定
const icon = document.createElement('link');
icon.rel = 'icon';
icon.href = 'https://matsuryo0619.github.io/scratchblog/img/icon.png'; // アイコンのURLを設定
document.head.appendChild(icon);

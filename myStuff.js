fetch('myStuff.json')
  .then(response => response.json())
  .then(data => {
    const jsonLength = data.length;

    for (let i = 0; i < jsonLength; i++) {
      fetch(`https://scratch.mit.edu/project/${data[i].id}/`)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFormString(html, "text/html");
          const false_title = doc.title;
          const title = false_title.slice(0, -11);
      console.log(`タイトル: ${title}, Site: ${data[i].site}`);
    }
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
  });

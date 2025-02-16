fetch('myStuff.json')
  .then(response => response.json())
  .then(data => {
    const jsonLength = data.length;

    for (let i = 0; i < jsonLength; i++) {
      console.log(`Iteration ${i + 1}:`);
      console.log(`ID: ${data[i].id}, Site: ${data[i].site}`);
    }
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
  });

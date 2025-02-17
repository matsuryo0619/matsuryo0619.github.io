document.addEventListener('DOMContentLoaded', function() {
  const resultList = document.getElementById('projects');

  async function fetchData() {
    let data = [];
    try {
      const response = await fetch('myStuff.json');
      if (!response.ok) throw new Error('データ取得に失敗しました');

      data = await response.json();
      console.log('データ取得成功', data);

      dataDisplay(data);
    } catch (error) {
      console.error(error);
      resultList.innerHTML = '<p>データを取得できませんでした</p>';
    }
  }

  function dataDisplay(data) {
    resultList.innerHTML = '';

    data.forEach(item => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('projectList');
      projectDiv.innerHTML = `
        <h3><a href='${item.site}'

      resultList.appendChild(projectDiv);
    });
  }

  fetchData();
});

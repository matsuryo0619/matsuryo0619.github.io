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

      const link = document.createElement('a');
      link.textContent = item.title;
      link.href = item.site || '#'; // siteが空ならリンクなし
      link.target = '_blank';

      projectDiv.appendChild(link);
      resultList.appendChild(projectDiv);
    });
  }

  fetchData();
});

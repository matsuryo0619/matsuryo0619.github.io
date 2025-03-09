document.addEventListener('DOMContentLoaded', function() {
  const resultList = document.getElementById('projects');

  async function fetchData() {
    try {
      const response = await fetch('myStuff.json');
      if (!response.ok) throw new Error('データ取得に失敗しました');

      const data = await response.json();
      console.log('データ取得成功', data);

      dataDisplay(data);
    } catch (error) {
      console.error(error);
      resultList.innerHTML = '<p>データを取得できませんでした</p>';
    }
  }

  function dataDisplay(data) {
    resultList.innerHTML = ''; // 一旦クリア

    data.forEach(item => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('projectList');

      // 修正した部分
      projectDiv.innerHTML = `
        <div class="project-header">
          <h3><a href="https://matsuryo0619.github.io/scratchblog/link.html?link=${encodeURIComponent('https://scratch.mit.edu/projects/' + item.id)}" target="_blank" class="preview-link">${item.text}</a></h3>
          <span class="user-name" data-user="${item.user || '不明'}">${item.user || '不明'}</span>
        </div>
        <p class="project-content">${item.content || '説明なし'}</p>
        <p><strong>タグ:</strong> ${item.tags ? item.tags.join(', ') : 'なし'}</p>
      `;

      resultList.appendChild(projectDiv);
    });

    // 🔹 ユーザーネームをクリックすると、新しいタブでScratchのプロフィールページを開く
    document.querySelectorAll('.user-name').forEach(userElement => {
      userElement.addEventListener('click', function() {
        const userName = this.getAttribute('data-user');
        if (userName !== '不明') {
          window.open(`https://scratch.mit.edu/users/${userName}/`, '_blank');
        }
      });
    });
  }

  fetchData();
});

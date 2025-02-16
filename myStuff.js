async function getProjectInfo() {
  try {
    const response = await fetch('myStuff.json');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      try {
        // Scratch公式APIからプロジェクト情報を取得
        const projectResponse = await fetch(`https://api.scratch.mit.edu/projects/${data[i].id}/`);
        if (!projectResponse.ok) {
          throw new Error(`HTTP error! status: ${projectResponse.status}`);
        }
        const projectData = await projectResponse.json();

        // タイトルを取得して表示
        console.log(`タイトル: ${projectData.title}, Site: ${data[i].site}`);

      } catch (projectError) {
        console.error(`Error fetching project ${data[i].id}:`, projectError);
      }
    }
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

getProjectInfo();

async function getProjectInfo() {
  try {
    // myStuff.jsonを取得
    const response = await fetch('myStuff.json');
    const data = await response.json();

    // 各プロジェクトIDについて、GAS APIを呼び出してタイトルを取得
    for (let i = 0; i < data.length; i++) {
      try {
        // GASのAPIエンドポイントにリクエストを送信
        const projectId = data[i].id;
        const apiUrl = `https://script.google.com/macros/s/your-script-id/exec?id=${projectId}`;
        
        // GAS APIからプロジェクト情報を取得
        const projectResponse = await fetch(apiUrl);
        const projectData = await projectResponse.json();

        // 取得したタイトルを表示
        if (projectData.title) {
          console.log(`プロジェクトタイトル: ${projectData.title}`);
          console.log(`関連サイト: ${data[i].site}`);
        } else {
          console.log(`プロジェクトID ${projectId} のタイトルが見つかりませんでした。`);
        }

      } catch (projectError) {
        console.error(`Error fetching project ${data[i].id}:`, projectError);
      }
    }
  } catch (error) {
    console.error('Error fetching myStuff.json:', error);
  }
}

getProjectInfo();

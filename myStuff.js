async function getProjectInfo() {
  try {
    const response = await fetch('myStuff.json');
    const data = await response.json();  // JSONデータを取得

    for (let i = 0; i < data.length; i++) {
      try {
        const projectId = data[i].id;  // myStuff.jsonからIDを取得
        const apiUrl = `https://script.google.com/macros/s/AKfycbxMqchIXx20DKA-Gm8tT0f7iCiw_ycU8EBbKXNnsItMSQxQb2gaESCbFLgj4L0jjA7juQ/exec?id=${projectId}`;
        
        const projectResponse = await fetch(apiUrl);
        
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();

          // プロジェクトデータ全体をログに出力して確認
          console.log('プロジェクトデータ全体:', projectData);

          // ここで必要なフィールドを取り出して表示
          if (projectData.title) {
            console.log(`プロジェクトID: ${projectId} - タイトル: ${projectData.title}`);
          } else {
            console.log(`プロジェクトID: ${projectId} - タイトルが見つかりません`);
          }
        } else {
          throw new Error(`プロジェクトID ${projectId} の取得に失敗しました。`);
        }
      } catch (projectError) {
        console.error(`プロジェクトID ${data[i].id} の処理中にエラーが発生しました:`, projectError);
      }
    }
  } catch (error) {
    console.error('myStuff.json の読み込み中にエラーが発生しました:', error);
  }
}

getProjectInfo();

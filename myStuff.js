async function getProjectInfo() {
  try {
    // myStuff.jsonを読み込む
    const response = await fetch('myStuff.json');
    const data = await response.json();  // JSONデータを取得

    // dataが配列だと仮定して、各プロジェクトIDを使ってGASのAPIにリクエスト
    for (let i = 0; i < data.length; i++) {
      try {
        const projectId = data[i].id;  // myStuff.jsonからIDを取得
        const apiUrl = `https://script.google.com/macros/s/AKfycbxMqchIXx20DKA-Gm8tT0f7iCiw_ycU8EBbKXNnsItMSQxQb2gaESCbFLgj4L0jjA7juQ/exec?id=${projectId}`;
        
        // GAS APIにリクエストを送信
        const projectResponse = await fetch(apiUrl);
        
        // レスポンスが正常なら、JSONとしてパース
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          console.log(`プロジェクトID: ${projectId} - タイトル: ${projectData.title}`);
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

// 関数を実行
getProjectInfo();

async function getProjectInfo() {
  try {
    const response = await fetch('myStuff.json');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      try {
        const projectResponse = await fetch(`https://scratch.mit.edu/project/${data[i].id}/`);
        if (!projectResponse.ok) {
          throw new Error(`HTTP error! status: ${projectResponse.status}`);
        }
        const html = await projectResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        if (doc.documentElement.nodeName === "html") {
            const false_title = doc.title;
            const title = false_title.slice(0, -11);
            console.log(`タイトル: ${title}, Site: ${data[i].site}`);
        } else {
            console.error(`Error parsing HTML for project ${data[i].id}:`, doc.documentElement);
        }

      } catch (projectError) {
        console.error(`Error fetching project ${data[i].id}:`, projectError);
      }
    }
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

getProjectInfo();

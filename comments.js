document.addEventListener('PageFinish', function() {
  const NGComments = ["死ね", "バカ", ".exe"];
  const regex = new RegExp(NGComments.join("|"));

  function test(wcheck) {
    if (wcheck.match(regex) != null) {
      alert("ERROR: コメントにNGワードが含まれています");
      return false;
    }
    return true;
  }

  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  function convertScratchblocks(text) {
    // { ... } を <div class='scratchblocks'> に変換
    return text.replace(/\{([\s\S]+?)\}/g, function(_, content) {
      return `<div class='scratchblocks'>${content.trim()}</div>`;
    });
  }

  function createGoogleForm() {
    const formId = "1FAIpQLSeJi8SiLCAtUaep3Z7wGK0H2OZosK_YEaRMo7vxB_VEFrWq8g";
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    const form = document.createElement("form");
    form.action = formUrl;
    form.method = "post";
    form.id = 'Comment_form';

    const nameParagraph = document.createElement("p");
    const nameInput = document.createElement("input");
    nameInput.name = "entry.691642850";
    nameInput.placeholder = "スクラッチネーム";
    nameInput.value = "匿名";
    nameInput.required = true;
    nameInput.id = "form_Name";
    nameParagraph.appendChild(nameInput);
    form.appendChild(nameParagraph);
    nameInput.addEventListener('focus', function() { this.select(); });

    const commentParagraph = document.createElement("p");
    const commentTextarea = document.createElement("textarea");
    commentTextarea.name = "entry.1605539997";
    commentTextarea.placeholder = "コメント";
    commentTextarea.rows = 10;
    commentTextarea.cols = 40;
    commentTextarea.maxLength = 400;
    commentTextarea.id = "Comments_wcheck";
    commentTextarea.required = true;
    commentParagraph.appendChild(commentTextarea);
    form.appendChild(commentParagraph);
    commentTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) submitInput.click();
    });

    commentTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = `${Math.min(this.value.split('\n').length * 20, 200)}px`;
    });

    const dataValue = getUrlParameter("data");
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "entry.148490561";
    hiddenInput.value = "art" + dataValue;
    form.appendChild(hiddenInput);

    const submitInput = document.createElement("input");
    submitInput.type = "submit";
    submitInput.id = "submitbutton";
    submitInput.value = "送信";
    form.appendChild(submitInput);

    const comments_div = document.createElement('div');
    const comments_text = document.createElement('h3');
    comments_text.textContent = 'コメント';
    const comments_allshow = document.createElement('a');
    comments_allshow.href = `https://matsuryo0619.github.io/comments.html?data=${dataValue}`;
    comments_allshow.textContent = 'すべて表示';
    comments_div.appendChild(comments_text);
    comments_div.appendChild(comments_allshow);

    const div = document.createElement('div');
    div.id = 'commentsArea';
    div.appendChild(comments_div);
    div.appendChild(form);

    document.getElementById('Rough_menu').appendChild(div);
    submitInput.disabled = true;

    commentTextarea.addEventListener('input', function() {
      submitInput.disabled = commentTextarea.value.trim() === "";
    });

    form.onsubmit = function(event) {
      event.preventDefault();
      if (!test(commentTextarea.value)) return false;

      submitInput.disabled = true;
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      form.target = "hidden_iframe";
      form.submit();

      const scrollY = window.scrollY;
      setTimeout(() => {
        location.reload();
        window.scrollTo(0, scrollY);
      }, 1000);
      return true;
    };
  }

  createGoogleForm();

  const comments = document.createElement('div');
  comments.id = 'comments';
  document.getElementById('commentsArea').appendChild(comments);

  const exp = /((?<!href="|href='|src="|src=')(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  fetch("https://docs.google.com/spreadsheets/d/14j4HxVdHec5ELwRGyZKpehI8hM8Jpa1AppqqK3pKUA4/export?format=csv&range=A1:D")
    .then(response => response.text())
    .then(function(csvText) {
      const data = d3.csvParse(csvText);
      data.reverse();

      const This_siteID = 'art' + getUrlParameter("data");
      const filteredData = data.filter(entry => entry["サイトID"] === This_siteID);

      let text = "";

      if (filteredData.length === 0) {
        text = "<p>コメントはまだありません</p>";
      } else {
        filteredData.forEach((entry, index) => {
          const name = entry["ペンネーム"];
          const timestamp = entry["タイムスタンプ"];
          let commentsText = entry["コメント"];

          commentsText = commentsText.replace(exp, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" data-linktype="comment">${url}</a>`;
          });

          // Scratchblocks変換を追加
          commentsText = convertScratchblocks(commentsText);

          const rawHtml = marked.parse(commentsText);
          const cleanText = DOMPurify.sanitize(rawHtml, {
            ALLOWED_TAGS: ['p','br','strong','em','code','pre','a','ul','ol','li','blockquote','h1','h2','h3','h4','h5','h6','table','thead','tbody','tr','th','td','hr','div'],
            ALLOWED_ATTR: ['href','target','rel','data-linktype', 'class'],
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM: false
          }).replace(/<(?!\/?(?:p|br|strong|em|code|pre|a|ul|ol|li|blockquote|h[1-6]|table|thead|tbody|tr|th|td|hr|div)(?:\s|>))[^>]*>/g, function(match){
            return match.replace(/</g,"&lt;").replace(/>/g,"&gt;");
          });

          const commentNumber = filteredData.length - index;
          const commentId = `comments_No${commentNumber}`;
          const fullUrl = `${location.origin}${location.pathname}?data=${getUrlParameter('data')}&comments=${commentNumber}`;

          const userLink = `https://scratch.mit.edu/users/${name}/`;
          let nameHTML;
          if (name === "匿名" || !/^[a-zA-Z0-9_-]+$/.test(name)) {
            nameHTML = `${commentNumber} 名前: ${name} ${timestamp}`;
          } else {
            nameHTML = `${commentNumber} 名前: <a href="${userLink}" target="_blank">${name}</a> ${timestamp}`;
          }

          const copyLinkHTML = `<span class="copy-link" data-url="${fullUrl}" style="margin-left: 10px; cursor: pointer;">🔗 コピー</span>`;

          text += `<div class="Comment_block" id="${commentId}">${nameHTML} ${copyLinkHTML}<div class='Comment_text'>${cleanText}</div></div>`;
        });
      }

      document.getElementById("comments").innerHTML = text;
      
      scratchblocks.renderMatching('.Comment_text .scratchblocks', { languages: ["ja"], style: "scratch3" });

      document.querySelectorAll('.Comment_text a').forEach(anchor => {
        let url = anchor.href;
        if (!/^https?:\/\//.test(url)) url = 'https://' + url;
        anchor.href = url;
        anchor.target = '_blank';
      });

      const params = new URLSearchParams(window.location.search);
      const commentNo = params.get('comments');
      if (commentNo !== null && /^\d+$/.test(commentNo)) {
        const target = document.getElementById(`comments_No${commentNo}`);
        if (target) {
          const rect = target.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({ top: rect.top + scrollTop - 40, behavior: 'smooth' });
        }
      }
    })
    .catch(function(error) {
      console.error("コメントデータの読み込みに失敗しました:", error);
      document.getElementById("comments").innerHTML = "<p>コメントの取得に失敗しました</p>";
    });

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-link')) {
      const url = e.target.getAttribute('data-url');
      navigator.clipboard.writeText(url).then(() => {
        e.target.textContent = '✅ コピー済み';
        setTimeout(() => { e.target.textContent = '🔗 コピー'; }, 2000);
      }).catch(() => { alert("コピーに失敗しました"); });
    }
  });
});

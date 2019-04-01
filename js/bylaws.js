fetch('https://raw.githubusercontent.com/upewpi/documents/master/bylaws.md')
  .then((res) => res.text())
  .then((data) => {
    var content = document.getElementsByClassName('content')[0];
    content.innerHTML = markdown.toHTML(data);
  });

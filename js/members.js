fetch('data/members.csv')
  .then(res => res.text())
  .then(data => {
    var parsed = Papa.parse(data);
    var initiations = {};
    for (var i = 1; i < parsed.data.length; i++){
      var member = parsed.data[i];
      if (!member[0]){
        continue;
      }
      if (initiations[+member[0]]){
        initiations[+member[0]].push(member[1]);
      } else {
        initiations[+member[0]] = [member[1]];
      }
    }

    var initiationsDiv = document.getElementById('initiations');

    var initiationString = "";

    var initiationYears = Object.keys(initiations);
    initiationYears = initiationYears.sort().reverse();

    initiationYears.forEach(year => {
      var members = initiations[year];
      initiationString += "<h3>Initiation #" + year + "</h3><ul>";
      members.forEach(member => {
        initiationString += "<li>" + member + "</li>"
      });
      initiationString += "</ul>";
    });

    initiationsDiv.innerHTML = initiationString;

  });

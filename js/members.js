loadInitiations().then(initiations => {
  loadInductees().then(inductees => {
    var initiationsDiv = document.getElementById('initiations');
    var combinedInitiations = {
      'initiations': initiations,
      'inductees': inductees
    };
    if (initiations && initiationsDiv){
      var htmlGenerator = new InductionListGenerator();
      initiationsDiv.innerHTML = htmlGenerator.toHTML(combinedInitiations);
    }
  });
});

  function loadInductees(){
    return fetch('data/members.csv')
      .then(res => res.text())
      .then(data => parseMembersCSV(data));
  }

function loadInitiations(){
  return fetch('data/initiations.csv')
    .then(res => res.text())
    .then(data => parseInitiationsCSV(data));
}

/**
 * An HTML generator which converts a map of initation to member names to an unordered list.
 * @constructor
 */
function InductionListGenerator(){

  function inducteesToHTML(initiation, date, inductees){
    var initiationString = initationToHTML(date, initiation);
    initiationString += "\n<ul>"
    inductees.sort().forEach(member => {
      initiationString += memberToHTML(member) + "\n";
    });
    initiationString += "</ul>\n";
    return initiationString;
  }

  function initationToHTML(date, initiation){

    var postfix = "th";
    switch (initiation % 10){
      case 1:
        postfix = "st";
        break;
      case 2:
        postfix = "nd";
        break;
      case 3:
        postfix = "rd";
        break;
    }

    return "<h3>" + date + ", " +  initiation + postfix + " Initiation</h3>";
  }

  function memberToHTML(memberName){
    return "<li>" + memberName + "</li>";
  }

  /**
   * Converts a map of induction year to member names to HTML.
   * @param  {map<number, [string]>} initiations a map of induction year to member names
   * @return {string} the HTML string
   */
  this.toHTML = function(initiations){
    var initiationString = "";

    var initiationYears = Object.keys(initiations.initiations);
    initiationYears = initiationYears.sort().reverse();

    initiationYears.forEach(initiation => {
      initiationString += inducteesToHTML(initiation, initiations.initiations[initiation], initiations.inductees[initiation]);
    });
    return initiationString;
  }
}

function parseInitiationsCSV(csvString){
  var parsed = Papa.parse(csvString);
  var initiations = {};
  for (var i = 1; i < parsed.data.length; i++){
    var initiation = parsed.data[i];
    if (!initiation[0]){
      continue;
    }
    initiations[+initiation[0]] = initiation[1];
  }
  return initiations;
}


function parseMembersCSV(csvString){
  var parsed = Papa.parse(csvString);
  var initiations = {};
  for (var i = 1; i < parsed.data.length; i++){
    var member = parsed.data[i];
    if (!member[0]){
      continue;
    }
    if (initiations[+member[0]]){
      initiations[+member[0]].push(member[1])
    } else {
      initiations[+member[0]] = [member[1]];
    }
  }
  return initiations;
}

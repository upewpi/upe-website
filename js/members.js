loadInitiations().then(initiations => {
    var initiationsDiv = document.getElementById('initiations');
    if (initiations && initiationsDiv){
      var htmlGenerator = new InductionListGenerator();
      initiationsDiv.innerHTML = htmlGenerator.toHTML(initiations);
    }
  });


function loadInitiations(){
  return fetch('data/members.csv')
    .then(res => res.text())
    .then(data => parseMembersCSV(data));
}

/**
 * An HTML generator which converts a map of initation to member names to an unordered list.
 * @constructor
 */
function InductionListGenerator(){

  function inducteesToHTML(initation, inductees){
    var initiationString = initationToHTML(initation);
    initiationString += "\n<ul>"
    inductees.forEach(member => {
      initiationString += memberToHTML(member) + "\n";
    });
    initiationString += "</ul>\n";
    return initiationString;
  }

  function initationToHTML(initation){
    return "<h3>" + initation + "</h3>";
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

    initiationYears.forEach(initation => {
      initiationString += inducteesToHTML(initiations.initiations[initation], initiations.inductees[initation]);
    });
    return initiationString;
  }
}

function parseMembersCSV(csvString){
  var parsed = Papa.parse(csvString);
  var initiations = {
    "initiations": {},
    "inductees": {}
  };
  for (var i = 1; i < parsed.data.length; i++){
    var member = parsed.data[i];
    if (!member[0]){
      continue;
    }
    if (initiations.initiations[+member[0]]){
      initiations.inductees[+member[0]].push(member[2])
    } else {
      initiations.initiations[+member[0]] = member[1];
      initiations.inductees[+member[0]] = [member[2]];
    }
  }
  return initiations;
}

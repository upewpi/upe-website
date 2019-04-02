fetch('data/members.csv')
  .then(res => res.text())
  .then(data => {
    var initiations = parseMembersCSV(data);
    var initiationsDiv = document.getElementById('initiations');
    if (initiations && initiationsDiv){
      var htmlGenerator = new InductionListGenerator();
      initiationsDiv.innerHTML = htmlGenerator.toHTML(initiations);
    }
  });

/**
 * An HTML generator which converts a map of induction year to member names to an unordered list.
 * @constructor
 */
function InductionListGenerator(){

  function inducteesToHTML(year, inductees){
    var initiationString = "<h3>Initiation #" + year + "</h3>\n<ul>";
    inductees.forEach(member => {
      initiationString += memberToHTML(member) + "\n";
    });
    initiationString += "</ul>\n";
    return initiationString;
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

    var initiationYears = Object.keys(initiations);
    initiationYears = initiationYears.sort().reverse();

    initiationYears.forEach(year => {
      initiationString += inducteesToHTML(year, initiations[year]);
    });
    return initiationString;
  }
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
      initiations[+member[0]].push(member[1]);
    } else {
      initiations[+member[0]] = [member[1]];
    }
  }
  return initiations;
}

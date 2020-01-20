var inducteeLoadingStrategy = new CSVInducteeLoadingStrategy('data/members.csv', 'data/initiations.csv');

inducteeLoadingStrategy.load().then(combinedInitiations => {
  var initiationsDiv = document.getElementById('initiations');
  if (combinedInitiations.initiations && initiationsDiv){
    var htmlGenerator = new ListHTMLGeneratorStrategy();
    initiationsDiv.innerHTML = htmlGenerator.toHTML(combinedInitiations);
  }
});

// Loading Strategies
// InducteeLoadingStrategy.load() -> Promise<{'inductees': Map<initiation # (number), names (String [*])>,
//                                            'initiations': Map<initiation # (number), date (String)>}>

function Member(initiation, name, inactive) {
  this.initiation = parseInt(initiation);
  this.name = name;
  // If inactive isn't passed, the member is by default active
  this.inactive = inactive === undefined ? false : JSON.parse(inactive);
}

/**
 * An inductee loading strategy which loads inductees from two CSV files (initiation number, date) and (initiation number, name)
 * @constructor
 */
function CSVInducteeLoadingStrategy(inducteeCSVFilename, initiationCSVFilename){

  function parseInitiationsCSV(csvString){
    var parsed = Papa.parse(csvString);
    var initiations = {};
    for (var i = 1; i < parsed.data.length; i++){
      var initiation = parsed.data[i];
      if (!initiation[0]){
        continue;
      }
      initiations[parseInt(initiation[0])] = initiation[1];
    }
    return initiations;
  }


  function parseMembersCSV(csvString){
    var parsed = Papa.parse(csvString);
    var initiations = {};
    for (var i = 1; i < parsed.data.length; i++){
      var raw_member = parsed.data[i];
      if (!raw_member[0]){
        continue;
      }

      var member = new Member(...raw_member);
      if (initiations[member.initiation]){
        initiations[member.initiation].push(member)
      } else {
        initiations[member.initiation] = [member];
      }
    }
    return initiations;
  }

  function loadInductees(){
    return fetch(inducteeCSVFilename)
      .then(res => res.text())
      .then(data => parseMembersCSV(data));
  }

  function loadInitiations(){
    return fetch(initiationCSVFilename)
      .then(res => res.text())
      .then(data => parseInitiationsCSV(data));
  }

  this.load = function(){
    return loadInitiations().then(initiations => {
      return loadInductees().then(inductees => {
        return {
          'initiations': initiations,
          'inductees': inductees
        };
      });
    });
  };
}

// HTML generator strategies
// HTMLGeneratorStrategy.toHTML(initiations) -> String
// @see InducteeLoadingStrategy#load() for details on the initiations object

/**
 * An HTML generator which converts a map of initation to member names to an unordered list.
 * @constructor
 */
function ListHTMLGeneratorStrategy(){

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

  function memberToHTML(member){
    let memberString = member.name;
    memberString += member.inactive ? ' <span class="inactive">(inactive)</span>' : '';

    return `<li>${memberString}</li>`;
  }

  /**
   * Converts a map of induction year to member names to HTML.
   * @param  {map<number, [string]>} initiations a map of induction year to member names
   * @return {string} the HTML string
   */
  this.toHTML = function(initiations){
    var initiationString = "";

    var initiationYears = Object.keys(initiations.initiations);
    initiationYears = initiationYears.map(elt => parseInt(elt)).sort((a1, a2) => a2 - a1);

    initiationYears.forEach(initiation => {
      initiationString += inducteesToHTML(initiation, initiations.initiations[initiation], initiations.inductees[initiation]);
    });
    return initiationString;
  }
}

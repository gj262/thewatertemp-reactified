var allStations = require("./stations-02-22-2020");

console.log(
  JSON.stringify(
    allStations.map(stn => {
      return {
        name: stn.name + (stn.state ? ", " + stn.state : ""),
        id: stn.id
      };
    })
  )
);

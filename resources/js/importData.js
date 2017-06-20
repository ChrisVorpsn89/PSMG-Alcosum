var timeLine = "2010";
var reportYear = "Year";

var xhReq = new XMLHttpRequest();
xhReq.open("GET", "data/countries.geo.json", false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);

xhReq.open("GET", "data/converted_2000_2016.json", false);
xhReq.send(null);
var reportOne = JSON.parse(xhReq.responseText);

function completeData(timeLine){
  reportYear = "Year" + timeLine;
  for(var j = 0; j < jsonObject.features.length; j++){
    console.log(jsonObject.features[j].properties.name);
    for(var k = 0; k < reportOne.length; k++){
      if(reportOne[k].Country == jsonObject.features[j].properties.name){
        if(reportOne[k].BeverageTypes == " Beer"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);
          };

        if(reportOne[k].BeverageTypes == " Wine"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);
          };

          if(reportOne[k].BeverageTypes == " Spirits"){
            console.log(reportOne[k].BeverageTypes);
            console.log(reportOne[k][reportYear]);
          };

          if(reportOne[k].BeverageTypes == " All types"){
            console.log(reportOne[k].BeverageTypes);
            console.log(reportOne[k][reportYear]);
          };
      };
    };
  };
};

function beerData(timeLine){
  reportYear = "Year" + timeLine;
  for(var j = 0; j < jsonObject.features.length; j++){
    console.log(jsonObject.features[j].properties.name);
    for(var k = 0; k < reportOne.length; k++){
      if(reportOne[k].Country == jsonObject.features[j].properties.name){
        if(reportOne[k].BeverageTypes == " Beer"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);

          };
        };
      };
    };
};

function wineData(year){
  reportYear = "Year" + timeLine;
  for(var j = 0; j < jsonObject.features.length; j++){
    console.log(jsonObject.features[j].properties.name);
    for(var k = 0; k < reportOne.length; k++){
      if(reportOne[k].Country == jsonObject.features[j].properties.name){
        if(reportOne[k].BeverageTypes == " Wine"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);

          };
        };
      };
    };
};

function spiritsData(timeLine){
  reportYear = "Year" + timeLine;
  for(var j = 0; j < jsonObject.features.length; j++){
    console.log(jsonObject.features[j].properties.name);
    for(var k = 0; k < reportOne.length; k++){
      if(reportOne[k].Country == jsonObject.features[j].properties.name){
        if(reportOne[k].BeverageTypes == " Spirits"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);

          };
        };
      };
    };
};

function allTypesData(year){
  reportYear = "Year" + timeLine;
  for(var j = 0; j < jsonObject.features.length; j++){
    console.log(jsonObject.features[j].properties.name);
    for(var k = 0; k < reportOne.length; k++){
      if(reportOne[k].Country == jsonObject.features[j].properties.name){
        if(reportOne[k].BeverageTypes == " All Types"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);
          
          };
        };
      };
    };
};

/**
completeData(timeLine);
beerData(timeLine);
wineData(timeLine);
spiritsData(timeLine);
**/

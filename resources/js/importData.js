var xhReq = new XMLHttpRequest();
xhReq.open("GET", "data/countries.geo.json", false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);
var url;
var reportOne,reportTwo,reportThree,currentReport;
var highestAllTypesValue = 26, highestBeerValue = 10, highestWineValue = 20, highestSpiritsValue = 14;
var scalelevel = 8;
var selectedBeverage = document.getElementById("selectedBeverage"),
averageConsumeVal = document.getElementById("averageConsumeVal"),
countryNumber = document.getElementById("countryNumber"),
timeLine = "",
selectedType = " All types";
currentReport = reportOne;

//Generates the different JSON data which is meant to be used for the correct period of years.
function getJsonData(){
url1 = "data/converted_2000_2016.json";
url2 ="data/converted_1999_1980.json";
url3 ="data/converted_1979_1966.json";
  xhReq.open("GET", url1, false);
  xhReq.send(null);
  reportOne = JSON.parse(xhReq.responseText);
  xhReq.open("GET", url2, false);
  xhReq.send(null);
  reportTwo = JSON.parse(xhReq.responseText);
  xhReq.open("GET", url3, false);
  xhReq.send(null);
  reportThree = JSON.parse(xhReq.responseText);
}

//Parsing the JSON with centroids of all countries necessary to place icons correctly
//JSON by http://gothos.info/2009/02/centroids-for-countries/
var centroidJSON;
function getCentroidsJSON (){
    url = "data/centroids.json";
    xhReq.open("GET", url, false);
    xhReq.send(null);
    centroidJSON = JSON.parse(xhReq.responseText);
}

function manipulateJson(report, feature){
    specificCountryJson = report.filter(function(el){
        return  el.Country == feature.O.name && el.BeverageTypes == selectedType;
        });

    for (var i = 0; i< specificCountryJson.length; i++){
        var obj = specificCountryJson[i];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
            if(obj[key] == "null"){
                obj[key] = 0.0;
              }
            }
        var temp = {};
            if(key !== "Country" && key !== "BeverageTypes"){
            temp["year"]= parseFloat(key.slice(4,8).toString());
            temp["consume"]= parseFloat(obj[key]);
            barChartdata.push(temp);
            }
        }
    }
}

//Relevant to indicate the numbers of participated countries, the average consume and highest value of the year.
function findHighestValue(slidervalue, currentreport){
    countCountry = 0;
    countConsume = 0;
    highestValue = 0;
    count = 0;
    var reportYear = "Year" + timeLine;
    for( var j = 0; j < jsonObject.features.length;j++){
      for(var k = 0; k < currentReport.length; k++){
        if(currentReport[k].Country == jsonObject.features[j].properties.name){
          if(currentReport[k].BeverageTypes == selectedType){
            var value = parseFloat(currentReport[k][reportYear]);
            if(value >= 0){
            countConsume += value;
            countCountry += 1;
            }
              if(value > highestValue){
                highestValue = value;
                countryhighestvalue =  currentReport[k].Country;
              }
          }
        }
      }
    }
    averageConsume = countConsume/countCountry;
    countryNumber.innerHTML = countCountry.toString();
    averageConsumeVal.innerHTML = averageConsume.toFixed(2);
}

function setUpValues(tempFeature, resolution){
var reportYear = "Year" + timeLine;
  for(var k = 0; k < currentReport.length; k++){
    if(currentReport[k].Country == tempFeature.O.name){
      if(currentReport[k].BeverageTypes == selectedType){
        var value = parseFloat(currentReport[k][reportYear]);
          if(value > highestValue){
            highestValue = value;
            countryhighestvalue =  currentReport[k].Country;
          }
      }
        if(currentReport[k].BeverageTypes == " Beer"){
        //Beer added
        tempFeature.set(" Beer", currentReport[k][reportYear]);
      }
        if(currentReport[k].BeverageTypes == " Wine"){
        //Wine added
        tempFeature.set(" Wine", currentReport[k][reportYear]);
        }
        if(currentReport[k].BeverageTypes == " Spirits"){
        //Spirits added
        tempFeature.set(" Spirits", currentReport[k][reportYear]);
        }
        if(currentReport[k].BeverageTypes == " All types"){
        //Total added
        tempFeature.set(" All types", currentReport[k][reportYear]);
        }
    }
  }
}

//Formating the legend with the correct values for the selected alcohol type.
function legendData(type){
  type = selectedType;
  if(selectedType == " All types"){
    highestBeverageValue = highestAllTypesValue;
  }
    if(selectedType == " Beer"){
    highestBeverageValue = highestBeerValue;
  }
    if(selectedType == " Wine"){
    highestBeverageValue = highestWineValue;
  }
    if(selectedType == " Spirits"){
    highestBeverageValue = highestSpiritsValue;
  }
  var summand = highestBeverageValue/scalelevel;
  document.getElementById("legend-box-b").innerHTML = "0 - " + parseInt(summand);
  document.getElementById("legend-box-c").innerHTML = parseInt(summand) + " - " + parseInt(2*summand);
  document.getElementById("legend-box-d").innerHTML = parseInt(2*summand) + " - " + parseInt(3*summand);
  document.getElementById("legend-box-e").innerHTML = parseInt(3*summand) + " - " + parseInt(4*summand);
  document.getElementById("legend-box-f").innerHTML = parseInt(4*summand) + " - " + parseInt(5*summand);
  document.getElementById("legend-box-g").innerHTML = parseInt(5*summand) + " - " + parseInt(6*summand);
  document.getElementById("legend-box-h").innerHTML = parseInt(6*summand) + " - " + parseInt(7*summand);
  document.getElementById("legend-box-i").innerHTML = parseInt(7*summand) + " - " + parseInt(8*summand);
  return highestBeverageValue;
}

getCentroidsJSON();
getJsonData();

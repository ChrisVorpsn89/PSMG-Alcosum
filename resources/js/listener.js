// Code inspired by http://seiyria.com/bootstrap-slider
// Creates the timeslider which returns the value of the selected year to the function getYear()
var slider = new Slider('#timeslider', {
	formatter: function(value) {
		document.getElementById("timeSliderVal").textContent = value;
		getYear(value);
	}
});

//Adds an "change" eventlistener to the selection elements which returns the selected alcohol type.
//The selected type is getting passed to the function legendData() to format the legend and triggers the function findHighestValue().
//Last but no least the graph BarChart and the Map are getting refreshed.
selectedBeverage.addEventListener("change", function(){
  selectedType = selectedBeverage.options[selectedBeverage.selectedIndex].value;
  legendData(selectedType);
  findHighestValue();
if(currentFeature !== null && !!document.getElementById("tempSVG")){
    manageGraph(currentFeature);
    }
  countrySource.refresh({force:true});
});


//Gets passed the selected year to get ride of the correct JSON Data which is meant to be used.
function getYear(sliderValue){
  if(sliderValue > 1999 ){
      currentReport = reportOne;
  } else if(sliderValue <= 1999 && sliderValue > 1979) {
      currentReport = reportTwo;
    } else if (sliderValue <= 1979){
      currentReport = reportThree;
      }
  timeLine = String(sliderValue);
  findHighestValue();
  countrySource.refresh({force:true});
}

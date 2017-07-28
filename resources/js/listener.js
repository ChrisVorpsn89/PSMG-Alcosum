var slider = new Slider('#timeslider', {
	formatter: function(value) {
		document.getElementById("timeSliderVal").textContent = value;
		getYear(value);
	}
});

selectedBeverage.addEventListener("change", function(){
  selectedType = selectedBeverage.options[selectedBeverage.selectedIndex].value;
  legendData(selectedType);
  findHighestValue();
if(currentFeature !== null && !!document.getElementById("tempSVG")){
    manageGraph(currentFeature);
    }
  countrySource.refresh({force:true});
});

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

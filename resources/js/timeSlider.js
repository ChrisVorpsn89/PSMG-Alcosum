/**var slider = new Slider("#timeslider");
slider.on("slide", function(sliderValue) {
	document.getElementById("timeSliderVal").textContent = sliderValue;
	console.log(sliderValue);
	getYear(sliderValue);
});**/

var slider = new Slider('#timeslider', {
	formatter: function(value) {
		document.getElementById("timeSliderVal").textContent = value;
		getYear(value);
	}
});

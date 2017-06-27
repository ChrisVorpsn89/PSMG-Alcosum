var slider = new Slider("#timeslider");

slider.on("slide", function(sliderValue) {
	document.getElementById("timeSliderVal").textContent = sliderValue;
});

// based on: https://bost.ocks.org/mike/bar/

var d3 = d3 || {};

function demo() {
    "use strict";
    var data, selection, bar, barUpdate, barEnter;
""
    data = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    selection = d3.select("#myContainer");      // select the container using the id selector
    bar = selection.selectAll("p");
    barUpdate = bar.data(data);    // initiate the data join by defining the selection to which we will join data
    barUpdate.text(function (d) { return d;});
    barUpdate.style("background-color", "green");

    barUpdate.exit().text(function (d) { return "NA"}); //fill empty <p> red and call it "NA"
    barUpdate.exit().style("background-color", "red"); //fill empty <p> red and call it "NA"

    selection.append("p").text(function (d) { return d3.sum(data)}); //append sum line

    barUpdate.style("width", function (d) { return d *10 + "px";}); // give every line his own width




    // join the data to the selection -> the returned selection is empty because there are no divs in myContainer

    //barEnter = barUpdate.enter().append("p"); // Enter selection: represents new data for which there is no element. We create missing elements by appending
    //barEnter.text(function (d) { return d;}); // set text of each new element
    //barEnter.style("width", function (d) { return d *10 + "px";});

  };

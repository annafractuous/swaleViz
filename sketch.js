  var options = ["temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "wind_speed_mph", "pressure_pa", "light_v"];
  var optionNames = ["Temperature", "Rain", "Humidity", "Wind Direction", "Wind Speed", "Pressure", "Light"];
  var tempMapped = [];
  var xTemp = [];
  var xVariable = "time";
  var yVariable = {};
  var possible = {};
  possible.temperature_f = [];
  possible.rain_in = [];
  possible.humidity_per = [];
  possible.wind_direction_deg = [];
  possible.wind_speed_mph = [];
  possible.pressure_pa = [];
  possible.light_v = [];

  var dropdown;
  var hold;
  var title;


  function setup() {
    // noLoop();

    createCanvas(windowWidth, windowHeight * 0.75);
    background(232);
    var url = 'http://54.235.200.47/tower';
    loadJSON(url, loadTemp);

    dropdown = createElement('select');
    dropdown.id('yAxis');
    for (var i = 0; i < options.length; i++) {
      var option = createElement('option');
      option.attribute('value', options[i]);
      option.html(optionNames[i]);
      option.parent(dropdown);
    }
    dropdown.position(width * 0.04, height * 0.85)
    var droptest = createDiv(dropdown.elt.value);
    dropdown.elt.onchange = function() {
      droptest.html(this.value);
    }

    droptest.position(width * 0.04, height / 2);
    droptest.style('transform', 'translate(' + 0 + 'px) rotate(' + 270 + 'deg)');
    droptest.class("axisLabels");
  }


  function mouseMoved() {

    for (var key in possible) {
      if (dropdown.elt.value === key) {
        yVariable = possible[key];
        drawTemp();
      } else {}
    }

  }

  function loadTemp(weather) {
    var xMin = width * 0.15;
    var xMax = width * 0.85;
    var yMin = height * 0.8;
    var yMax = height * 0.2;
    // get the humidity value out of the loaded JSON
    for (var i = 0; i < weather.results.length; i++) {
      possible.temperature_f.push(map(weather.results[i].temperature_f, 0, 100, yMin, yMax));
      possible.rain_in.push(map(weather.results[i].rain_in, 0, 5, yMin, yMax));
      possible.humidity_per.push(map(weather.results[i].humidity_per, 0, 100, yMin, yMax));
      possible.wind_direction_deg.push(map(weather.results[i].wind_direction_deg, 0, 360, yMin, yMax));
      possible.wind_speed_mph.push(map(weather.results[i].wind_speed_mph, 0, 20, yMin, yMax));
      possible.pressure_pa.push(map(weather.results[i].pressure_pa, 0, 150000, yMin, yMax));
      possible.light_v.push(map(weather.results[i].light_v, 0, 10, yMin, yMax));


      xTemp.push(map(i, 0, weather.results.length, xMin, xMax));
      // tempMapped.push(map(temperature_f[i], 0, 100, height - height / 3, height / 4));

    }

    // $("#yAxis").change(function() {
    //   var label = ($(this).find("option:selected").text());
    // });

    yVariable = possible.temperature_f;
    drawTemp();
    title = createDiv("Tower Data Over The Last " + weather.results.length + " Minutes");
    title.id('title');
    title.position(width * .5 - (textWidth("Tower Data Over The Last 30 Minutes")),  height * 0.08);

  }


  function drawTemp() {
    fill(232);
    stroke(232);
    rect(0, 0, width, height);
    majorLines();
    strokeLinesX();
    strokeLinesY();

    // console.log(yVariable);
    for (var r = possible.temperature_f.length; r >= 0; r--) {
      stroke(14, 164, 252);
      strokeWeight(4);

      line(xTemp[r - 1], yVariable[r - 1], xTemp[r], yVariable[r]);

    }
    // noFill();
    // stroke(86);
    // strokeWeight(9);
    // rect(30, 30, width - 60, height - 60);
  }

  function majorLines() {
    var xMin = width * 0.15;
    var xMax = width * 0.85;
    var yMin = height * 0.8;
    var yMax = height * 0.2;

    //major lines
    stroke(86);
    strokeWeight(1);
    line(xMin, yMin, xMax, yMin);
    // line(xMin, yMax, xMin, yMin);

  }

  function strokeLinesX(Xvalue) {
    var xMin = width * 0.15;
    var xMax = width * 0.85;
    var yMin = height * 0.8;
    var yMax = height * 0.2;
    //stroke lines
    stroke(86, 86, 86, 100);
    strokeWeight(0.5);
    for (var i = possible.temperature_f.length; i >= 0; i--) {
      var x = map(i, possible.temperature_f.length, 0, xMin, xMax);
      line(x, yMin - 3, x, yMin + 3);
      textSize(12);
      fill(86);
      strokeWeight(1);
      if (i % 2 == 1) {
        textFont("Source Code Pro");
        text(i, x, yMin + 20);
      }
    }
  }

  function strokeLinesY() {
    var xMin = width * 0.15
    var yMin = height * 0.8;
    var xMax = width * 0.85;
    textFont("Source Code Pro");
    if (yVariable == possible.temperature_f || yVariable == possible.humidity_per) {
      for (var z = 0; z < 110; z = z + 10) {
        // if (yVariable.)
        var y = map(z, 0, 100, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == possible.rain_in) {
      for (z = 0; z < 6; z++) {
        y = map(z, 0, 5, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == possible.wind_speed_mph) {
      for (z = 0; z < 21; z++) {
        y = map(z, 0, 20, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == possible.pressure_pa) {
      for (z = 0; z < 150000; z = z + 5000) {
        y = map(z, 0, 150000, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == possible.light_v) {
      for (z = 0; z < 11; z++) {
        y = map(z, 0, 10, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == possible.wind_direction_deg) {
      for (z = 0; z < 370; z= z + 20) {
        y = map(z, 0, 360, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    }
  }

var options = ["wind_speed_mph", "temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "pressure_pa", "light_v"],
    towerUrl = 'http://54.235.200.47/tower',
    yVariable = "wind_speed_mph",
    xCoordinates,
    yCoordinates,
    towerData,
    mappedValues,
    sensorValues,
    dropdown,
    title,
    optionsInfo;


function setEventListeners() {
  $('#yAxis').change(function() {
    yVariable = this.value;
    yCoordinates = mappedValues[this.value];
    $('#yAxisLabel').html(optionsInfo[this.value].text);
    redraw();
    updateSidebar();
  });

  window.setInterval(function(){
    loadJSON(towerUrl, update);
    redraw();
  }, 60000);
}


function preload() {
  towerData = loadJSON(towerUrl);
  require(['../data/data-options.js'], function(data) {
    optionsInfo = data;
  });
}


function setup() {
  drawCanvas();
  update(towerData);
  setEventListeners();
}


function update(weather) {
  clearPresentData();
  saveData(weather);
  updateDataSnapshots();
}


function updateDataSnapshots() {
  updateBottomBar();
  updateSidebar();
}


function drawCanvas() {
  // create graph canvas
  createCanvas(windowWidth, windowHeight * 0.75);
  background(248,252,252);

  // create dropdown menu for data types
  dropdown = createElement('select');
  dropdown.id('yAxis');
  for (var i = 0; i < options.length; i++) {
    var option = createElement('option');
    option.attribute('value', options[i]);
    option.html(optionsInfo[options[i]].text);
    option.parent(dropdown);
  }
  dropdown.position(width * 0.04, height * 0.85);

  // create y-axis label
  var yAxisLabel = createDiv(optionsInfo[dropdown.elt.value].text + " (" + optionsInfo[dropdown.elt.value].unit + ")");
  yAxisLabel.position(width * .15 - 130, height / 2);
  yAxisLabel.style('transform', 'rotate(270deg)');
  yAxisLabel.id("yAxisLabel");

  // create x-axis label
  var xAxisLabel = createDiv("minutes");
  xAxisLabel.position(width * .41, height * 0.87);
  xAxisLabel.id("xAxisLabel");

  // create title
  title = createDiv("Most Recent Tower Data");
  title.position(width * .5 - (textWidth("Most Recent Tower Data")*1.3),  height * 0.08);
  title.id('title');
}


function clearPresentData() {
  xCoordinates = [];
  yCoordinates = {};
  mappedValues = {};
  sensorValues = {};

  sensorValues["time"] = []; // include timestamps in sensorValues

  for (i = 0; i < options.length; i++) {  // sensorValues = {
    sensorValues[options[i]] = [];        //  temperature_f: [],
    mappedValues[options[i]] = [];        //  wind_speed_mph: [], ...
  }                                       // }
}


function saveData(weather) {
  var xMin = width * 0.15,
      xMax = width * 0.75,
      yMin = height * 0.8,
      yMax = height * 0.2;

  // weather.results returns an array of objects, with each index in the array
  // representing 1 minute and holding all sensor values (rain, temp, etc.) for that minute
  for (var i = 0; i < weather.results.length; i++) {
    // sensorValues restructures the same data into an object where the keys are the data type (rain, temp, etc.),
    // pointing to an array that holds all sensor values in that category from the past however many minutes
    sensorValues.temperature_f.push(Math.round(weather.results[i].temperature_f));
    sensorValues.rain_in.push(weather.results[i].rain_in.toFixed(2));
    sensorValues.humidity_per.push(weather.results[i].humidity_per);
    sensorValues.wind_direction_deg.push(weather.results[i].wind_direction_deg);
    sensorValues.wind_speed_mph.push(weather.results[i].wind_speed_mph.toFixed(1));
    sensorValues.pressure_pa.push((weather.results[i].pressure_pa / 1000).toFixed(1));
    sensorValues.light_v.push(weather.results[i].light_v);
    sensorValues.time.push(weather.results[i].date.split("T")[1].split("-")[0]); // 20:53:01

    // mappedValues contains sensor values mapped to the size of the canvas
    mappedValues.temperature_f.push(map(weather.results[i].temperature_f, 0, 100, yMin, yMax));
    mappedValues.rain_in.push(map(weather.results[i].rain_in, 0, 3, yMin, yMax));
    mappedValues.humidity_per.push(map(weather.results[i].humidity_per, 0, 100, yMin, yMax));
    mappedValues.wind_direction_deg.push(map(weather.results[i].wind_direction_deg, 0, 360, yMin, yMax));
    mappedValues.wind_speed_mph.push(map(weather.results[i].wind_speed_mph, 0, 20, yMin, yMax));
    mappedValues.pressure_pa.push(map(weather.results[i].pressure_pa, 0, 150000, yMin, yMax));
    mappedValues.light_v.push(map(weather.results[i].light_v, 0, 5, yMin, yMax));

    xCoordinates.push(map(i, 0, weather.results.length, xMin, xMax));
  }

  yCoordinates = mappedValues[yVariable];
}


function draw() {
  fill(232);
  stroke(232);
  rect(0, 0, width, height);

  drawMajorLines();
  drawXStrokes();
  drawYStrokes();
  drawLine();
}


function drawLine() {
  for (var r = sensorValues.temperature_f.length; r >= 0; r--) {
    stroke(14, 164, 252);
    strokeWeight(4);
    line(xCoordinates[r - 1], yCoordinates[r - 1], xCoordinates[r], yCoordinates[r]);
  }
}


function drawMajorLines() {
  var xMin = width * 0.15
      xMax = width * 0.75
      yMin = height * 0.8
      yMax = height * 0.2;

  stroke(86);
  strokeWeight(1);
  line(xMin, yMin, xMax, yMin);
}


function drawXStrokes(Xvalue) {
  var xMin = width * 0.15,
      xMax = width * 0.75,
      yMin = height * 0.8,
      yMax = height * 0.2;

  stroke(86, 86, 86, 100);
  strokeWeight(0.5);

  for (var i = mappedValues.temperature_f.length; i >= 0; i--) {
    var x = map(i, mappedValues.temperature_f.length, 0, xMin, xMax);
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


function drawYStrokes() {
  var xMin = width * 0.15,
      yMin = height * 0.8,
      xMax = width * 0.75,
      yMax = height * 0.2;

  textFont("Source Code Pro");

  function draw(y, z) {
    stroke(86, 86, 86, 100);
    strokeWeight(0.25);
    line(xMin - 3, y, xMax, y);
    text(z, xMin - 30, y + 5);
  }

  switch (yCoordinates) {
    case mappedValues.temperature_f:
    case mappedValues.humidity_per:
      for (var z = 0; z < 110; z = z + 10) {
        var y = map(z, 0, 100, yMin, yMax);
        draw(y, z);
      }
      break;
    case mappedValues.rain_in:
      for (z = 0; z < 4; z++) {
        y = map(z, 0, 3, yMin, yMax);
        draw(y, z);
      }
      break;
    case mappedValues.wind_speed_mph:
      for (z = 0; z < 21; z++) {
        y = map(z, 0, 20, yMin, yMax);
        draw(y, z);
      }
      break;
    case mappedValues.pressure_pa:
      for (z = 0; z < 150; z = z + 5) {
        y = map(z, 0, 150, yMin, yMax);
        draw(y, z);
      }
      break;
    case mappedValues.light_v:
      for (z = 0; z < 6; z++) {
        y = map(z, 0, 5, yMin, yMax);
        draw(y, z);
      }
      break;
    case mappedValues.wind_direction_deg:
      for (z = 0; z < 370; z= z + 20) {
        y = map(z, 0, 360, yMin, yMax);
        draw(y, z);
      }
      break;
  }
}

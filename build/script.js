// TO DO:
// update data every minute
// - clear present sensor values
// - clear canvas



var dataBarTemplate = $('#handlebars-data-bar').html(),
    dataBarTemplateScript = Handlebars.compile(dataBarTemplate),
    snapshotTemplate = $('#handlebars-snapshot').html(),
    snapshotTemplateScript = Handlebars.compile(snapshotTemplate);


function updateDataBar() {
  var dataBarData = {},
      lastIdx = sensorValues["temperature_f"].length - 1;

  dataBarData.temperature_f = Math.round(sensorValues["temperature_f"][lastIdx]);
  var tempCels = (sensorValues["temperature_f"][lastIdx] - 32) / 1.8;
  dataBarData.temperature_c = formatCelsiusTemp(Number(Math.round(tempCels + 'e1') + 'e-1'));
  dataBarData.windspeed = sensorValues["wind_speed_mph"][lastIdx];
  dataBarData.pressure = sensorValues["pressure_pa"][lastIdx];
  dataBarData.rainfall = sensorValues["rain_in"][lastIdx];

  var compiledHTML = dataBarTemplateScript(dataBarData);
  $('.data-bar .data').empty();
  $('.data-bar .data').append(compiledHTML);
}

function updateSnapshot() {
  var snapshotData = {},
      currentCat = $('#yAxisLabel').text(),
      lastIdx = sensorValues[currentCat].length - 1;

  snapshotData.current = sensorValues[currentCat][lastIdx];
  snapshotData.high = Math.max(...sensorValues[currentCat]);
  snapshotData.low = Math.min(...sensorValues[currentCat]);

  var compiledHTML = snapshotTemplateScript(snapshotData);
  $('.data-snapshot').empty();
  $('.data-snapshot').append(compiledHTML);
}

function formatCelsiusTemp(temp) {
  temp = temp.toString();
  var decimalIndex = temp.indexOf('.');
  return temp.slice(0, decimalIndex) + "<span class='decimal'>" + temp.slice(decimalIndex) + "</span>"
}

var options = ["wind_speed_mph", "temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "pressure_pa", "light_v"],
    optionNames = ["Wind Speed", "Temperature", "Rain", "Humidity", "Wind Direction", "Pressure", "Light"],
    towerUrl = 'http://54.235.200.47/tower',
    yVariable = "wind_speed_mph",
    xCoordinates = [],
    yCoordinates = {},
    mappedValues = {},
    sensorValues = {};

for (i = 0; i < options.length; i++) {
  sensorValues[options[i]] = [];
  mappedValues[options[i]] = [];
}

var dropdown,
    title;


function setup() {
  // create graph canvas
  createCanvas(windowWidth, windowHeight * 0.75);
  background(232);

  // create dropdown menu for data types
  dropdown = createElement('select');
  dropdown.id('yAxis');
  for (var i = 0; i < options.length; i++) {
    var option = createElement('option');
    option.attribute('value', options[i]);
    option.html(optionNames[i]);
    option.parent(dropdown);
  }
  dropdown.position(width * 0.04, height * 0.85);

  // create y-axis label
  var yAxisLabel = createDiv(dropdown.elt.value);
  yAxisLabel.position(width * .15 - 130, height / 2);
  yAxisLabel.style('transform', 'rotate(270deg)');
  yAxisLabel.id("yAxisLabel");

  // create x-axis label
  var xAxisLabel = createDiv("minutes passed");
  xAxisLabel.position(width * .41, height * 0.87);
  xAxisLabel.id("xAxisLabel");

  loadData();
  setEventListeners();
}


function loadData() {
  loadJSON(towerUrl, loadDataFunction);
}


function setEventListeners() {
  $('#yAxis').change(function() {
    $('#yAxisLabel').html(this.value);
    drawGraph();
    updateSnapshot();
  });

  // window.setInterval(function(){
  //
  // }, 60000);
}

function drawGraph() {
  for (var key in mappedValues) {
    if (dropdown.elt.value === key) {
      yCoordinates = mappedValues[key];
      drawValues();
    }
  }
}


function loadDataFunction(weather) {
  var xMin = width * 0.15,
      xMax = width * 0.75,
      yMin = height * 0.8,
      yMax = height * 0.2;

  for (var i = 0; i < weather.results.length; i++) {
    // weather.results returns an array of objects, with each index in the array
    // representing 1 minute and holding all sensor values (rain, temp, etc.) for that minute

    // sensorValues restructures the same data into an object where the keys are the data type (rain, temp, etc.),
    // pointing to an array that holds all sensor values in that category from the past however many minutes
    sensorValues.temperature_f.push(Math.round(weather.results[i].temperature_f));
    sensorValues.rain_in.push(weather.results[i].rain_in.toFixed(2));
    sensorValues.humidity_per.push(weather.results[i].humidity_per);
    sensorValues.wind_direction_deg.push(weather.results[i].wind_direction_deg);
    sensorValues.wind_speed_mph.push(weather.results[i].wind_speed_mph.toFixed(1));
    sensorValues.pressure_pa.push((weather.results[i].pressure_pa / 1000).toFixed(1));
    sensorValues.light_v.push(weather.results[i].light_v);

    // mappedValues contains ensor values mapped to the size of the canvas
    mappedValues.temperature_f.push(map(weather.results[i].temperature_f, 0, 100, yMin, yMax));
    mappedValues.rain_in.push(map(weather.results[i].rain_in, 0, 5, yMin, yMax));
    mappedValues.humidity_per.push(map(weather.results[i].humidity_per, 0, 100, yMin, yMax));
    mappedValues.wind_direction_deg.push(map(weather.results[i].wind_direction_deg, 0, 360, yMin, yMax));
    mappedValues.wind_speed_mph.push(map(weather.results[i].wind_speed_mph, 0, 20, yMin, yMax));
    mappedValues.pressure_pa.push(map(weather.results[i].pressure_pa, 0, 150000, yMin, yMax));
    mappedValues.light_v.push(map(weather.results[i].light_v, 0, 10, yMin, yMax));

    xCoordinates.push(map(i, 0, weather.results.length, xMin, xMax));
  }

  // create title
  title = createDiv("Tower Data Over The Last " + weather.results.length + " Minutes");
  title.id('title');
  title.position(width * .5 - (textWidth("Tower Data Over The Last 30 Minutes")),  height * 0.08);

  yCoordinates = mappedValues[yVariable];
  drawValues();
  updateDataBar();
  updateSnapshot();
}


function drawValues() {
  fill(232);
  stroke(232);
  rect(0, 0, width, height);
  majorLines();
  strokeLinesX();
  strokeLinesY();

  for (var r = sensorValues.temperature_f.length; r >= 0; r--) {
    stroke(14, 164, 252);
    strokeWeight(4);
    line(xCoordinates[r - 1], yCoordinates[r - 1], xCoordinates[r], yCoordinates[r]);
  }
}


function majorLines() {
  var xMin = width * 0.15
      xMax = width * 0.75
      yMin = height * 0.8
      yMax = height * 0.2;

  stroke(86);
  strokeWeight(1);
  line(xMin, yMin, xMax, yMin);
}


function strokeLinesX(Xvalue) {
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


function strokeLinesY() {
  var xMin = width * 0.15,
      yMin = height * 0.8,
      xMax = width * 0.75;

  textFont("Source Code Pro");

  function drawYStrokes(y, z) {
    stroke(86, 86, 86, 100);
    strokeWeight(0.25);
    line(xMin - 3, y, xMax, y);
    text(z, xMin - 30, y + 5);
  }

  switch (yCoordinates) {
    case mappedValues.temperature_f:
    case mappedValues.humidity_per:
      for (var z = 0; z < 110; z = z + 10) {
        var y = map(z, 0, 100, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    case mappedValues.rain_in:
      for (z = 0; z < 6; z++) {
        y = map(z, 0, 5, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    case mappedValues.wind_speed_mph:
      for (z = 0; z < 21; z++) {
        y = map(z, 0, 20, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    case mappedValues.pressure_pa:
      for (z = 0; z < 150000; z = z + 5000) {
        y = map(z, 0, 150000, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    case mappedValues.light_v:
      for (z = 0; z < 11; z++) {
        y = map(z, 0, 10, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    case mappedValues.wind_direction_deg:
      for (z = 0; z < 370; z= z + 20) {
        y = map(z, 0, 360, yMin, windowHeight / 4);
        drawYStrokes(y, z);
      }
      break;
    }
  }

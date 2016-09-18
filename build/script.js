function getCurrentValues(weather) {
  updateDataBar(weather);
  updateSnapshot(weather);
}

function updateDataBar(weather) {
  var dataBarData = {},
      lastIdx = weather.length - 1;

  dataBarData.temperature_f = Math.round(weather[lastIdx].temperature_f);
  var tempCels = (weather[lastIdx].temperature_f - 32) / 1.8;
  dataBarData.temperature_c = formatCelsiusTemp(Number(Math.round(tempCels + 'e1') + 'e-1'));
  dataBarData.windspeed = weather[lastIdx].wind_speed_mph.toFixed(1);
  dataBarData.pressure = (weather[lastIdx].pressure_pa / 1000).toFixed(1);
  dataBarData.rainfall = weather[lastIdx].rain_in.toFixed(2);

  var template = $('#handlebars-data-bar').html(),
      templateScript = Handlebars.compile(template),
      compiledHTML = templateScript(dataBarData);
  $('.data-bar').append(compiledHTML);
}

function updateSnapshot(weather) {
  var snapshotData = {},
      currentCat = $('.axisLabels').text(),
      lastIdx = weather.length - 1;

  snapshotData.current = sensorValues[currentCat][lastIdx];
  snapshotData.high = Math.max(...sensorValues[currentCat]);
  snapshotData.low = Math.min(...sensorValues[currentCat]);

  var template = $('#handlebars-snapshot').html(),
      templateScript = Handlebars.compile(template),
      compiledHTML = templateScript(snapshotData);
  $('.data-snapshot').append(compiledHTML);
}

function formatCelsiusTemp(temp) {
  temp = temp.toString();
  var decimalIndex = temp.indexOf('.');
  return temp.slice(0, decimalIndex) + "<span class='decimal'>" + temp.slice(decimalIndex) + "</span>"
}

  var options = ["wind_speed_mph", "temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "pressure_pa", "light_v"],
      optionNames = ["Wind Speed", "Temperature", "Rain", "Humidity", "Wind Direction", "Pressure", "Light"],
      tempMapped = [],
      xTemp = [],
      xVariable = "time",
      yVariable = {},
      mappedValues = {},
      sensorValues = {};

  for (i = 0; i < options.length; i++) {
    sensorValues[options[i]] = [];
    mappedValues[options[i]] = [];
  }

  var dropdown,
      hold,
      title;


  function setup() {
    // noLoop();

    createCanvas(windowWidth, windowHeight * 0.75);
    background(232);
    var url = 'http://54.235.200.47/tower';
    loadJSON(url, loadData);

    dropdown = createElement('select');

    dropdown.id('yAxis');
    for (var i = 0; i < options.length; i++) {
      var option = createElement('option');
      option.attribute('value', options[i]);
      option.html(optionNames[i]);
      option.parent(dropdown);
    }
    dropdown.position(width * 0.04, height * 0.85);
    dropdown.elt.onchange = function() {
      droptest.html(this.value);
    }

    var droptest = createDiv(dropdown.elt.value);
    droptest.position(width * .15 - 130, height / 2);
    droptest.style('transform', 'rotate(270deg)');
    droptest.class("axisLabels");
  }


  function mouseMoved() {
    for (var key in mappedValues) {
      if (dropdown.elt.value === key) {
        yVariable = mappedValues[key];
        drawTemp();
      } else {}
    }
  }

  function loadData(weather) {
    var xMin = width * 0.15;
    var xMax = width * 0.75;
    var yMin = height * 0.8;
    var yMax = height * 0.2;
    // get the humidity value out of the loaded JSON
    for (var i = 0; i < weather.results.length; i++) {
      // weather.results[i]
      //
      // {id : "57dd828601900f1ee90358a5",
      //  altitude_m : 6.7,
      //  battery_v : 4,
      //  date : "2016-09-17T13:51:02-0400",
      //  humidity_per : 49.5,
      //  latitude : 40.693534,
      //  light_v : 3.1,
      //  longitude : -74.001716,
      //  pressure_pa : 102124.25,
      //  rain_in : 0.01,
      //  satellites : 11,
      //  source : "tower",
      //  t_utc : 1474134662,
      //  temperature_f : 81.2,
      //  wind_direction_deg : 219,
      //  wind_speed_mph : 3.2}

      sensorValues.temperature_f.push(weather.results[i].temperature_f);
      sensorValues.rain_in.push(weather.results[i].rain_in.toFixed(2));
      sensorValues.humidity_per.push(weather.results[i].humidity_per);
      sensorValues.wind_direction_deg.push(weather.results[i].wind_direction_deg);
      sensorValues.wind_speed_mph.push(weather.results[i].wind_speed_mph.toFixed(1));
      sensorValues.pressure_pa.push((weather.results[i].pressure_pa / 1000).toFixed(1));
      sensorValues.light_v.push(weather.results[i].light_v);

      mappedValues.temperature_f.push(map(weather.results[i].temperature_f, 0, 100, yMin, yMax));
      mappedValues.rain_in.push(map(weather.results[i].rain_in, 0, 5, yMin, yMax));
      mappedValues.humidity_per.push(map(weather.results[i].humidity_per, 0, 100, yMin, yMax));
      mappedValues.wind_direction_deg.push(map(weather.results[i].wind_direction_deg, 0, 360, yMin, yMax));
      mappedValues.wind_speed_mph.push(map(weather.results[i].wind_speed_mph, 0, 20, yMin, yMax));
      mappedValues.pressure_pa.push(map(weather.results[i].pressure_pa, 0, 150000, yMin, yMax));
      mappedValues.light_v.push(map(weather.results[i].light_v, 0, 10, yMin, yMax));

      xTemp.push(map(i, 0, weather.results.length, xMin, xMax));
      // tempMapped.push(map(temperature_f[i], 0, 100, height - height / 3, height / 4));
    }

    // $("#yAxis").change(function() {
    //   var label = ($(this).find("option:selected").text());
    // });

    yVariable = mappedValues.wind_speed_mph;
    drawTemp();
    title = createDiv("Tower Data Over The Last " + weather.results.length + " Minutes");
    title.id('title');
    title.position(width * .5 - (textWidth("Tower Data Over The Last 30 Minutes")),  height * 0.08);

    getCurrentValues(weather.results);

  }


  function drawTemp() {
    fill(232);
    stroke(232);
    rect(0, 0, width, height);
    majorLines();
    strokeLinesX();
    strokeLinesY();

    // console.log(yVariable);
    for (var r = mappedValues.temperature_f.length; r >= 0; r--) {
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
    var xMax = width * 0.75;
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
    var xMax = width * 0.75;
    var yMin = height * 0.8;
    var yMax = height * 0.2;
    //stroke lines
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
    var xMin = width * 0.15
    var yMin = height * 0.8;
    var xMax = width * 0.75;
    textFont("Source Code Pro");
    if (yVariable == mappedValues.temperature_f || yVariable == mappedValues.humidity_per) {
      for (var z = 0; z < 110; z = z + 10) {
        // if (yVariable.)
        var y = map(z, 0, 100, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == mappedValues.rain_in) {
      for (z = 0; z < 6; z++) {
        y = map(z, 0, 5, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == mappedValues.wind_speed_mph) {
      for (z = 0; z < 21; z++) {
        y = map(z, 0, 20, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == mappedValues.pressure_pa) {
      for (z = 0; z < 150000; z = z + 5000) {
        y = map(z, 0, 150000, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == mappedValues.light_v) {
      for (z = 0; z < 11; z++) {
        y = map(z, 0, 10, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    } else if (yVariable == mappedValues.wind_direction_deg) {
      for (z = 0; z < 370; z= z + 20) {
        y = map(z, 0, 360, yMin, windowHeight / 4);
        stroke(86, 86, 86, 100);
        strokeWeight(0.25);
        line(xMin - 3, y, xMax, y);
        text(z, xMin - 30, y + 5);
      }
    }
  }

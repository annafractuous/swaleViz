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

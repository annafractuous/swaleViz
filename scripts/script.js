// TO DO:
// improve data snapshot for wind direction (high/low aren't very descriptive/applicable)
// frequent 504 error on retrieving tower data?
// temperature mapping is off (graphing degrees about 20° than they should be)
// is the time axis labeled correctly? according to the numbering along the bottom, it seems most recent values
//   should be to the right. but according to the timestamps, the most recent values are on the left.
// we should reconsider labeling the x-axis with minutes passed——sometimes the tower goes down, and data shown
//   is actually several hours old



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

  $('#num-minutes').html(sensorValues[yVariable].length);
}

function updateSnapshot() {
  var snapshotData = {},
      currentCat = dropdown.elt.value,
      lastIdx = sensorValues[currentCat].length - 1;

  snapshotData.current = sensorValues[currentCat][lastIdx];
  snapshotData.high = Math.max(...sensorValues[currentCat]);
  snapshotData.low = Math.min(...sensorValues[currentCat]);
  snapshotData.unit = optionsInfo[currentCat].unit;

  var compiledHTML = snapshotTemplateScript(snapshotData);
  $('.data-snapshot').empty();
  $('.data-snapshot').append(compiledHTML);

  $('#data-category').html(optionsInfo[currentCat].text);
  $('#data-description').html(optionsInfo[currentCat].description);
}

function formatCelsiusTemp(temp) {
  temp = temp.toString();
  var decimalIndex = temp.indexOf('.');
  return temp.slice(0, decimalIndex) + "<span class='decimal'>" + temp.slice(decimalIndex) + "</span>";
}

var bottomBarTemplate = $('#handlebars-data-bar').html(),
    bottomBarTemplateScript = Handlebars.compile(bottomBarTemplate),
    sidebarTemplate = $('#handlebars-snapshot').html(),
    sidebarTemplateScript = Handlebars.compile(sidebarTemplate);


function updateBottomBar() {
  var bottomBarData = {},
      lastIdx = sensorValues["temperature_f"].length - 1,
      time = new Date().toLocaleTimeString();

  bottomBarData.temperature_f = Math.round(sensorValues["temperature_f"][lastIdx]);
  var tempCels = (sensorValues["temperature_f"][lastIdx] - 32) / 1.8;
  bottomBarData.temperature_c = formatCelsiusTemp(Number(Math.round(tempCels + 'e1') + 'e-1'));
  bottomBarData.windspeed = sensorValues["wind_speed_mph"][lastIdx];
  bottomBarData.pressure = sensorValues["pressure_pa"][lastIdx];
  bottomBarData.rainfall = sensorValues["rain_in"][lastIdx];
  bottomBarData.time = time.replace(time.substring(5, 8), "");

  var compiledHTML = bottomBarTemplateScript(bottomBarData);
  $('.data-bar .data').empty();
  $('.data-bar .data').append(compiledHTML);
}

function updateSidebar() {
  var sidebarData = {},
      currentCat = dropdown.elt.value,
      lastIdx = sensorValues[currentCat].length - 1;

  sidebarData.current = sensorValues[currentCat][lastIdx];
  sidebarData.high = Math.max(...sensorValues[currentCat]);
  sidebarData.low = Math.min(...sensorValues[currentCat]);
  sidebarData.unit = optionsInfo[currentCat].unit;

  var compiledHTML = sidebarTemplateScript(sidebarData);
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

function formatDateTime(timeStr) {
  var regex   = /([0-9]*)-([0-9]*)-([0-9]*)T([0-9]{2}):([0-9]{2})/,
      groups  = regex.exec(timeStr),    // ["2016-10-17T07:20", "2016", "10", "17", "07", "20"]
      month   = groups[2],
      day     = groups[3],
      year    = groups[1],
      hour    = groups[4],
      minute  = groups[5],
      ampm;

  if (parseInt(hour) < 12) {
    ampm = "am";
  }
  else {
    hour = (parseInt(hour) - 12).toString();
    ampm = "pm";
  }

  return 1(month + "/" + day + "/" + year + " " + hour + ":" + minute + ampm);
}

var plantEntryTemplate = $('#plant-archive-entry').html(),
    plantEntryTemplateScript = Handlebars.compile(plantEntryTemplate);

var plants = {
  mint: {
    medicinal_use: ["facilitate digestion"],
    political_pairing: "Open Source Ecology Microhouse",
    poetic_text: "The plan of such a house will be characteristically different from all other houses. It need only be a room.",
    source: "http://opensourceecology.org/wiki/OSE_Microhouse"
  },
  lavender: {
    medicinal_use: ["restlessness", "insomnia", "nervousness", "depression", "headaches"],
    political_pairing: "Rachel Frank’s Rewilding Project",
    poetic_text: "I am reintroducing species to areas in which they had formerly thrived. Reclaiming. Relocation. Even the accidental.",
    source: "http://rachelfrank.com/Rewilding-in-progress"
  },
  raspberry: {
    medicinal_use: ["cervical health", "childbirth"],
    political_pairing: "Youth Ministries for Peace and Justice",
    poetic_text: "A rally mobilized 1,200 people and resulted in dance, music, muraling, film, poetry...",
    source: "http://www.ympj.org/"
  },
  chamomile: {
    medicinal_use: ["calming"],
    political_pairing: "AgroLifeCoin",
    poetic_text: "Agro-enterprises. Miners. All around the world. Lending.",
    source: "https://www.agrolifecoin.org/index.php/en/"
  },
  dandelion: {
    medicinal_use: ["process and digest fat"],
    political_pairing: "https://ourgoods.org/",
    poetic_text: "I wrote his project proposal and he made my design in glass.",
    source: "https://ourgoods.org/resources/faq/trust-and-integriy"
  },
  ginger: {
    medicinal_use: ["ulcers", "nausea", "diarrhea"],
    political_pairing: "g0v.tw",
    poetic_text: "We are a liquid democracy.",
    source: "http://g0v.tw/en-US/"
  },
  violet: {
    medicinal_use: ["colds", "coughs"],
    political_pairing: "http://www.biospherex.org/",
    poetic_text: "Living as an integral component in our small world. This effort confirms the fact that we rely on the life systems for survival, and at the same time, the ecological systems depend upon our efforts.",
    source: "http://www.biospherex.org/about"
  },
  marigold: {
    medicinal_use: ["anti-fungal", "anti-septic"],
    political_pairing: "http://www.solarcity.com/",
    poetic_text: "The system stores and creates energy throughout the day. Any extra energy flows back onto the grid. It is self-healing.",
    source: "https://vimeo.com/156485288"
  },
  rose: {
    medicinal_use: ["anti-depressant", "antispasmodic", "aphrodisiac", "astringent", "antibacterial", "antiviral", "antiseptic", "anti-inflammatory"],
    political_pairing: "http://biomearts.net/",
    poetic_text: " Coordinated patterns of greater and greater diversity.",
    source: "http://biomearts.net/mission/"
  },
  bee: {
    medicinal_use: ["anti-septic"],
    political_pairing: "100 resilient cities",
    poetic_text: "The shocks—earthquakes, fires, floods, etc.—the stresses that weaken the fabric of a city on a day to day or cyclical basis. high unemployment; endemic violence; chronic food and water shortages.",
    source: "http://www.100resilientcities.org/about-us#/-_/"
  },
  elderflower: {
    medicinal_use: ["flu", "sinusitus", "cold"],
    political_pairing: "Mary Mattingly",
    poetic_text: "In every way, shape, and form, we are at war. Art can cultivate systemic social change. Art can transform people’s perceptions about value, and collective art forms can reframe predominant ideologies.",
    source: "http://www.marymattingly.com/html/MATTINGLYManifesto.html"
  },
  ant: {
    medicinal_use: [],
    political_pairing: "Github",
    poetic_text: "Repositories are places where writers can share their work with the world and solicit feedback, while others can fork the story and make their own variation.",
    source: "https://github.com/showcases/writing"
  },
  apple: {
    medicinal_use: ["cancer", "hypertension", "diabetes", "heart disease"],
    political_pairing: "appleseed permaculture",
    poetic_text: "We are dynamically prepared for the rapid changes occurring in our global climate, energy, and economic systems. Families, communities, businesses, and governments work collaboratively for a graceful and ethical transition.",
    source: "http://www.appleseedpermaculture.com/about/vision/"
  },
  pear: {
    medicinal_use: ["diaretic", "anaglesic"],
    political_pairing: "a blade of grass",
    poetic_text: "Fieldworks. Lead poisoning. Pop up bookstore. Rebel coffee service. Bioremediation.",
    source: "http://www.abladeofgrass.org/FIELDWORKS"
  },
  lemon: {
    medicinal_use: ["antihypertensive", "antispasmodic", "diuretic", "antibacterial", "antifungal"],
    political_pairing: "Hyphae",
    poetic_text: "A floating barge, a functional model. A space for human enjoyment of the water.",
    source: "http://hyphae.net/journal/"
  },
  fennel: {
    medicinal_use: ["antispasmodic", "antidepressant", "stomachic", "pectoral", "diuretic", "diaphoretic", "aromatic", "anti-microbial", "pain reducing", "fever reducing"],
    political_pairing: "Experimental Farm Network",
    poetic_text: "A climate stabilizing agricultural system.",
    source: "http://experimentalfarmnetwork.org/"
  },
  oregano: {
    medicinal_use: ["antibacterial", "antifungal", "anti-inflammatory", "antioxidant", "anti-parasitic", "digestive aid"],
    political_pairing: "Eco-Trust",
    poetic_text: "Resilience.",
    source: "https://ecotrust.org/"
  }
};

function pullDownMenu() {
  $('.icon-pulldown').click(function() {
    $('.plant-archive').toggleClass('open');
  });
}

function showPlantEntry() {
  $('.plant-archive__menu-icon').click(function() {
    var plant = $(this).attr("data-plant");
    updatePlantEntry(plant);
    $('.plant-archive__menu').hide();
    $('.plant-archive__entry').show();
  });
}

function showArchiveMenu() {
  $('.plant-archive__entry-menu-btn .icon-grid').click(function() {
    $('.plant-archive__entry').hide();
    $('.plant-archive__menu').show();
  });
}

function updatePlantEntry(plant) {
  var plantEntryData = Object.assign({},
    plants[plant],
    {name: plant,
    symbol: "<span class='icon-" + plant + "'></span>",
    source: "<a href='" + plants[plant].source + "' target='_blank'>" + plants[plant].source + "</a>",
    medicinal_use: plants[plant].medicinal_use.join(",</p><p>")}
  );
  var compiledHTML = plantEntryTemplateScript(plantEntryData);
  $('.plant-archive__entry-content').empty();
  $('.plant-archive__entry-content').append(compiledHTML);
}

pullDownMenu();
showPlantEntry();
showArchiveMenu();

var options = ["wind_speed_mph", "temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "pressure_pa", "light_v"],
    towerUrl = 'http://54.235.200.47/tower',
    yVariable = "wind_speed_mph",
    xCoordinates,
    yCoordinates,
    towerData,
    mappedValues,
    sensorValues,
    dropdown,
    title;

var optionsInfo = {
  wind_speed_mph: {
    text: "wind speed",
    unit: "MPH",
    description: "There are dozens of us! DOZENS! Dad would stage elaborate situations using a one-armed man to teach us lessons. Could it be love?"
  },
  temperature_f: {
    text: "temperature (°f)",
    unit: "°F",
    description: "Walter, you can't do that. These guys're like me, they're pacifists. No, Donny, these men are nihilists, there's nothing to be afraid of."
  },
  rain_in: {
    text: "rain",
    unit: "in",
    description: "A very small stage in a vast cosmic arena the sky calls to us galaxies bits of moving fluff ship of the imagination, kindling the energy hidden in matter."
  },
  humidity_per: {
    text: "humidity",
    unit: "%",
    description: "A surprise party? Mr. Worf, I hate surprise parties. Some days you get the bear, and some days the bear gets you. Yesterday I did not know how to eat gagh."
  },
  wind_direction_deg: {
    text: "wind direction",
    unit: "°",
    description: "Fore heave to boatswain parley nipper capstan bilged on her anchor strike colors ahoy grog. Carouser hearties aft cable splice the main brace Sea Legs warp tack sloop."
  },
  pressure_pa: {
    text: "pressure",
    unit: "kPa",
    description: "If you spell Chuck Norris in Scrabble, you win. Chuck Norris' hand is the only hand that can beat a Royal Flush. Chuck Norris is the reason why Waldo is hiding."
  },
  light_v: {
    text: "light",
    unit: "Volts",
    description: "Alright, alright, okay McFly, get a grip on yourself. It's all a dream. Just a very intense dream. He's an absolute dream. You know Marty, you look so familiar, do I know your mother?"
  }
}


function preload() {
  towerData = loadJSON(towerUrl);
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

var App = App || {};

App = {
    init: function() {
        new p5(App.Graph);
        App.Handlebars.init();
        App.DataSnapshots.init();
        App.PlantArchive.init();

        this.pages = $('article');
        this.navItems = $('.nav__item');
        this.addNavEventListeners();
    },

    addNavEventListeners: function() {
        this.navItems.click(function(e) {
            var nextPage = $(e.target).data('page');
            this.navItems.filter('.selected').removeClass('selected');
            $(e.target).addClass('selected');
            this.pages.filter('.in-view').removeClass('in-view');
            this.pages.filter(nextPage).addClass('in-view');
        }.bind(this));
    }
}

$(function() {
    App.init();
});

var App = App || {};

App.DataSnapshots = {
    init: function(getHandlebarsPartials) {
        this.compileHandlebarsTemplates();
        this.cacheSelectors();
    },

    compileHandlebarsTemplates: function() {
        var bottomBarTemplate = $('#handlebars-data-bar').html();
        var sidebarTemplate = $('#handlebars-snapshot').html();

        this.bottomBarTemplateScript = Handlebars.compile(bottomBarTemplate);
        this.sidebarTemplateScript = Handlebars.compile(sidebarTemplate);
    },

    cacheSelectors: function() {
        this.dropdown = $('.sidebar__dropdown')[0];
        this.dataBar = $('.data-bar .data');
        this.dataSnapshot = $('.data-snapshot');
    },

    updateBottomBar: function(sensorValues) {
        var bottomBarData = {},
            currentTime = new Date().toLocaleTimeString(),
            lastIdx = sensorValues["temperature_f"].length - 1;

        var tempCels = (sensorValues["temperature_f"][lastIdx] - 32) / 1.8;
        bottomBarData.temperature_c = this.formatCelsiusTemp(Number(Math.round(tempCels + 'e1') + 'e-1'));
        bottomBarData.temperature_f = Math.round(sensorValues["temperature_f"][lastIdx]);
        bottomBarData.windspeed     = sensorValues["wind_speed_mph"][lastIdx];
        bottomBarData.pressure      = sensorValues["pressure_pa"][lastIdx];
        bottomBarData.rainfall      = sensorValues["rain_in"][lastIdx];
        bottomBarData.time          = currentTime.replace(currentTime.substring(4, 7), " ");

        var compiledHTML = this.bottomBarTemplateScript(bottomBarData);

        this.dataBar.empty();
        this.dataBar.append(compiledHTML);
    },

    updateSidebar: function(sensorValues, optionsInfo) {
        var sidebarData = {},
            currentCat = this.dropdown.value,
            lastIdx = sensorValues[currentCat].length - 1;

        sidebarData.current = sensorValues[currentCat][lastIdx];
        sidebarData.high    = Math.max(...sensorValues[currentCat]);
        sidebarData.low     = Math.min(...sensorValues[currentCat]);
        sidebarData.unit    = optionsInfo[currentCat].unit;

        var compiledHTML = this.sidebarTemplateScript(sidebarData);

        this.dataSnapshot.empty();
        this.dataSnapshot.append(compiledHTML);
    },

    formatCelsiusTemp: function(temp) {
        var temp = temp.toString();
        var idx = temp.indexOf('.');

        return temp.slice(0, idx) + "<span class='decimal'>" + temp.slice(idx) + "</span>";
    },

    formatDateTime: function(timeStr) {
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

        return (month + "/" + day + "/" + year + " " + hour + ":" + minute + ampm);
    }
}

var App = App || {};

App.Handlebars = {
    init: function() {
        this.partials = [
            {
                fileName: 'plant-entry',
                targetNode: '#handlebars-plant-entry'
            },
            {
                fileName: 'data-bar',
                targetNode: '#handlebars-data-bar'
            },
            {
                fileName: 'snapshot',
                targetNode: '#handlebars-snapshot'
            }
        ]
        this.getAllPartials();
    },

    getAllPartials: function() {
        for (var i = 0; i < this.partials.length; i++) {
            this.getPartial(this.partials[i].fileName, this.partials[i].targetNode);
        }
    },

    getPartial: function(fileName, targetNode) {
        $.ajax({
            url : '../templates/' + fileName + '.hbs',
            success : function(data) {
                $(targetNode).html(data);
            },
            async : false
        });
    }
}

var App = App || {};

App.PlantArchive = {
    init: function(getHandlebarsPartials) {
        this.getPlantData();
        this.assignVariables();
        this.compileHandlebarsTemplates();
        this.setEventListeners();
    },

    getPlantData: function() {
        var _this = this;
        $.ajax({
              url: 'data/archive.json',
              dataType: 'json',
              success: function(data) {
                  _this.plants = data;
              },
              error: function(errorMsg) {
                  console.log(errorMsg);
              }
        });
    },

    assignVariables: function() {
        this.plantArchive = $('.plant-archive');
        this.archiveMenu = $('.plant-archive__menu');
        this.archiveEntry = $('.plant-archive__entry');
        this.entryContent = $('.plant-archive__entry-content');
    },

    compileHandlebarsTemplates: function() {
        var plantEntryTemplate = $('#handlebars-plant-entry').html();
        this.plantEntryTemplateScript = Handlebars.compile(plantEntryTemplate);
    },

    setEventListeners: function() {
        this.showPlantEntry();
        this.showArchiveMenu();
    },

    showPlantEntry: function() {
        $('.plant-archive__menu-icon').click(function(e) {
            var plant = $(e.target).attr("data-plant");
            this.updatePlantEntry(plant);
            this.archiveMenu.hide();
            this.archiveEntry.show();
        }.bind(this));
    },

    showArchiveMenu: function() {
        $('.plant-archive__entry-menu-btn .icon-grid').click(function() {
            this.archiveEntry.hide();
            this.archiveMenu.show();
        }.bind(this));
    },

    updatePlantEntry: function(plant) {
        var plantEntryData = Object.assign({},
            this.plants[plant],
            {
                name: plant,
                symbol: "<span class='icon-" + plant + "'></span>",
                source: "<a href='" + this.plants[plant].source + "' target='_blank'>" + this.plants[plant].source + "</a>",
                medicinal_use: this.plants[plant].medicinal_use.join(",</p><p>")}
            );
        var compiledHTML = this.plantEntryTemplateScript(plantEntryData);
        this.entryContent.empty();
        this.entryContent.append(compiledHTML);
    }
}

var App = App || {};

App.Graph = function( p5 ) {

    var yAxisLabel = $('#yAxisLabel'),
        dataTime = $('.sidebar__time'),
        options = ["wind_speed_mph", "temperature_f", "rain_in", "humidity_per", "wind_direction_deg", "pressure_pa", "light_v"],
        // towerUrl = 'http://54.235.200.47/tower',
        towerUrl = 'data/latest-weather-data.json',
        yVariable = "wind_speed_mph",
        xCoordinates,
        yCoordinates,
        xMin,
        xMax,
        yMin,
        yMax,
        towerData,
        mappedValues,
        sensorValues,
        optionsInfo,
        lastTime,
        dropdown;


    p5.preload = function() {
        p5.loadJSON('data/data-options.json', function(data) {
                optionsInfo = data;
                drawCanvas();
            },
            function(errorMsg) {
                console.log(errorMsg);
            }
        );
    }


    p5.setup = function() {
        p5.loadJSON(towerUrl, function(towerData) {
                update(towerData);
                drawChart();
                listenForUpdates();
            },
            function(errorMsg) {
                console.log(errorMsg);
            }
        );
    }


    p5.draw = function() {
        p5.background('#f7f7f7');
        p5.noLoop();
    }


    function drawCanvas() {
        // create graph canvas
        var canvas = p5.createCanvas(p5.windowWidth * 0.6, p5.windowHeight * 0.75);
        canvas.parent("canvas");

        // set graph boundaries
        xMin = p5.width * 0.05;
        xMax = p5.width * 0.95;
        yMin = p5.height * 0.85;
        yMax = p5.height * 0.15;

        // populate dropdown menu for data types
        dropdown = $('.sidebar__dropdown')[0];
        for (var i = 0; i < options.length; i++) {
            var option = p5.createElement('option');
            option.attribute('value', options[i]);
            option.html(optionsInfo[options[i]].text);
            option.parent(dropdown);
        }

        // fill in y-axis label
        yAxisLabel.html(optionsInfo[dropdown.value].text + " (" + optionsInfo[dropdown.value].unit + ")");
    }


    function drawChart() {
        p5.fill(232);
        p5.stroke(232);
        p5.rect(0, 0, p5.width, p5.height);

        drawAxes();
        drawXStrokes();
        drawYStrokes();
        drawGraph();
    }


    function drawAxes() {
        p5.stroke(86);
        p5.strokeWeight(1);
        p5.line(xMin, yMin, xMax, yMin);
    }


    function drawXStrokes() {
        p5.stroke(86, 86, 86, 100);
        p5.strokeWeight(0.5);

        for (var i = mappedValues.temperature_f.length; i >= 0; i--) {
            var x = p5.map(i, mappedValues.temperature_f.length, 0, xMin, xMax);

            p5.line(x, yMin - 3, x, yMin + 3);
            p5.textSize(12);
            p5.fill(86);
            p5.strokeWeight(1);

            if (i % 2 == 1) {
                p5.textFont("Source Code Pro");
                p5.text(i, x, yMin + 20);
            }
        }
    }


    function drawYStrokes() {
        switch (yCoordinates) {
            case mappedValues.temperature_f:
            case mappedValues.humidity_per:
                mapY(10, 100);
                break;
            case mappedValues.rain_in:
                mapY(1, 3);
                break;
            case mappedValues.wind_speed_mph:
                mapY(1, 20);
                break;
            case mappedValues.pressure_pa:
                mapY(5, 150);
                break;
            case mappedValues.light_v:
                mapY(1, 5);
                break;
            case mappedValues.wind_direction_deg:
                mapY(20, 360);
                break;
        }
    }

    function mapY (zInterval, zMax) {
        for (var z = 0; z <= zMax; z += zInterval) {
            var y = p5.map(z, 0, zMax, yMin, yMax);
            drawY(y, z);
        }
    }

    function drawY(y, z) {
        p5.stroke(86, 86, 86, 100);
        p5.strokeWeight(0.25);
        p5.line(xMin - 3, y, xMax, y);
        p5.textFont("Source Code Pro");
        p5.text(z, xMin - 30, y + 5);
    }


    function drawGraph() {
        for (var r = sensorValues.temperature_f.length; r >= 0; r--) {
            p5.stroke(14, 164, 252);
            p5.strokeWeight(4);
            p5.line(xCoordinates[r - 1], yCoordinates[r - 1], xCoordinates[r], yCoordinates[r]);
        }
    }


    function update(weather) {
        clearPresentData();
        saveData(weather);
        updateDataSnapshots();
    }


    function clearPresentData() {
        xCoordinates = [];
        yCoordinates = {};
        mappedValues = {};
        sensorValues = {};

        sensorValues["time"] = [];

        for (var i = 0; i < options.length; i++) {  // sensorValues = {
            sensorValues[options[i]] = [];      //  temperature_f: [],
            mappedValues[options[i]] = [];      //  wind_speed_mph: [], ...
        }                                       // }
    }


    function saveData(weather) {
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
            mappedValues.temperature_f.push(p5.map(weather.results[i].temperature_f, 0, 100, yMin, yMax));
            mappedValues.rain_in.push(p5.map(weather.results[i].rain_in, 0, 3, yMin, yMax));
            mappedValues.humidity_per.push(p5.map(weather.results[i].humidity_per, 0, 100, yMin, yMax));
            mappedValues.wind_direction_deg.push(p5.map(weather.results[i].wind_direction_deg, 0, 360, yMin, yMax));
            mappedValues.wind_speed_mph.push(p5.map(weather.results[i].wind_speed_mph, 0, 20, yMin, yMax));
            mappedValues.pressure_pa.push(p5.map(weather.results[i].pressure_pa, 0, 150000, yMin, yMax));
            mappedValues.light_v.push(p5.map(weather.results[i].light_v, 0, 5, yMin, yMax));

            xCoordinates.push(p5.map(i, 0, weather.results.length, xMin, xMax));
        }

        yCoordinates = mappedValues[yVariable];
        lastTime = weather.results[weather.results.length - 1]['date'];
    }


    function updateDataSnapshots() {
        App.DataSnapshots.updateBottomBar(sensorValues);
        App.DataSnapshots.updateSidebar(sensorValues, optionsInfo);
    }


    function listenForUpdates() {
        $('.sidebar__dropdown').change(function() {
            yVariable = this.value;
            yCoordinates = mappedValues[this.value];
            yAxisLabel.html(optionsInfo[this.value].text);
            drawChart();
            App.DataSnapshots.updateSidebar(sensorValues, optionsInfo);
        });

        // refresh every 60 sec
        window.setInterval(function(){
            p5.loadJSON(towerUrl, update);
            drawChart();
            dataTime.html(App.DataSnapshots.formatDateTime(lastTime));
        }, 60000);
    }
};

var App = App || {};

App.DataSnapshots = {
    init: function() {
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
        this.dataCategory = $('#data-category');
        this.time = $('.sidebar__time');
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

    updateTimeAndCategory: function(optionsInfo) {
        this.dataCategory.html(optionsInfo[currentCat].text);
        this.time.html(this.formatDateTime(lastTime));
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

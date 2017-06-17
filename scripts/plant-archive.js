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
        this.pullDownMenu();
        this.showPlantEntry();
        this.showArchiveMenu();
    },

    pullDownMenu: function() {
        $('.icon-pulldown').click(function() {
            this.plantArchive.toggleClass('open');
        }.bind(this));
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

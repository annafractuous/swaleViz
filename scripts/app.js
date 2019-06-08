var App = App || {};

App = {
    init: function() {
        App.Handlebars.init();

        this.pages = $('article');
        this.navItems = $('.nav__item');
        this.activePage = $('.nav__item.selected').data('page');
        
        this.archiveInitiated = false;
        
        this.addNavEventListeners();
        this.loadTowerData();
    },

    addNavEventListeners: function() {
        this.navItems.click(function(e) {
            var navItem, nextPage;

            navItem  = e.target;
            nextPage = $(navItem).data('page');

            App.setActivePage(navItem, nextPage);
            App.initPage(nextPage);
        }.bind(this));
    },

    setActivePage: function(navItem, nextPage) {
        $('.selected').removeClass('selected');
        $('.in-view').removeClass('in-view');
        $(navItem).addClass('selected');
        $(nextPage).addClass('in-view');
        this.activePage = nextPage;
    },

    initPage: function(nextPage) {
        if (nextPage === '.plant-archive') {
            if (!this.archiveInitiated) {
                App.PlantArchive.init();
                this.archiveInitiated = true;
            } else {
                App.PlantArchive.start();                
            }
        }
        else {
            if (nextPage === '.data') {
                new p5(App.Graph);
                App.DataSnapshots.init();
            }
        }
    },

    loadTowerData: function() {
        $.ajax({
			url: 'data/latest-weather-data.json',
			dataType: 'json',
			success: function (data) {
				window.towerData = data;
			},
			error: function (errorMsg) {
				console.log(errorMsg);
			}
		});
    }
}

$(function() {
    App.init();
});

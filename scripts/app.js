var App = App || {};

App = {
    init: function() {
        App.Handlebars.init();

        this.pages = $('article');
        this.navItems = $('.nav__item');
        this.addNavEventListeners();
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

    setActivePage(navItem, nextPage) {
        $('.selected').removeClass('selected');
        $('.in-view').removeClass('in-view');
        $(navItem).addClass('selected');
        $(nextPage).addClass('in-view');
    },

    initPage(nextPage) {
        if (nextPage === '.plant-archive') {
            App.PlantArchive.init();
        } 
        else if (nextPage === '.graph') {
            new p5(App.Graph);
            App.DataSnapshots.init();
        }
    }
}

$(function() {
    App.init();
});

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

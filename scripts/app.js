var App = App || {};

App = {
    init: function() {
        new p5(App.Graph);
        App.Handlebars.init();
        App.DataSnapshots.init();
        App.PlantArchive.init();
        this.addNavEventListeners();
    },

    addNavEventListeners: function() {
        $('.nav__item').click(function(e) {
            var currentPage = $('.in-view');
            var nextPage = $(e.target).data('page');
            $(currentPage).removeClass('in-view');
            $(nextPage).addClass('in-view');
        });
    }
}

$(function() {
    App.init();
});

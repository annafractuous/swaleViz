var App = App || {};

App = {
    init: function() {
        new p5(App.Graph);
        App.DataSnapshots.init();
        App.PlantArchive.init();
    }
}

$(function() {
    App.init();
});

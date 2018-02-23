var App = App || {};

App.Handlebars = {
    init: function() {
        this.partials = [
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

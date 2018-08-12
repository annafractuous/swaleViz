var App = App || {};

App.CustomParticles = {
    init: function() {
        this.particles = pJSDom[0].pJS.particles;

        /**************
        particle color
        ***************/
        // changes the color of existing particles
        this.particles.color.rgb = {r: 66, g: 191, b: 244};
        // sets the color of new particles, e.g. those created when you click somewhere
        // (the hex value should match the RGB value above if you want new particles to match existing color)
        this.particles.color.value = '#42BFF4';

        /*************
        particle size
        **************/
        // changes the size of existing particles
        this.updateParticles('radius', 21);
        // changes the size of new particles, e.g. those created when you click somewhere
        // (same deal as color——if you want new particles to match existing size, value should match that above)
        this.particles.size.value = 7;
        // little function to make the particles expand & contract
        this.particlePulse();

        /**************
        particle speed
        ***************/
        // changes the speed of existing particles, applies to all new particles
        this.particles.move.speed = 7;

        /**********
        line color
        ***********/
        // changes the color of existing lines, applies to all new lines
        this.particles.line_linked.color_rgb_line = {r: 142, g: 229, b: 174};

        /*********
        line width
        **********/
        // changes the size of existing lines, applies to all new lines
        this.particles.line_linked.width = 2;

        console.log(pJSDom);
    },

    particlePulse: function() {
        var size, increasing, _this;
        
        size = 1;
        increasing = true;
        
        _this = this;
        this.interval = setInterval(function() {
            _this.updateParticles('radius', size);
            if (size === 40) {
                increasing = false;
            } else if (size === 1) {
                increasing = true;
            }
            increasing ? size++ : size--;
        }, 100)
    },

    updateParticles: function(property, value) {
        for (var i = 0, l = this.particles.array.length; i < l; i++) {
            var p = this.particles.array[i];
            p[property] = value;
            p.draw();
        }
    }
}
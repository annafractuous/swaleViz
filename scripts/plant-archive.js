var App = App || {};

App.PlantArchive = {
    init: function() {
        this.getPlantData();
        this.getParticleData();
        this.saveVariables();
        this.setParameters();
    },

    getPlantData: function() {
        var _this = this;
        $.ajax({
              url: 'data/archive.json',
              dataType: 'json',
              success: function(data) {
                  _this.scenes = _this.shuffleScenes(data.scenes);
                  _this.start();
              },
              error: function(errorMsg) {
                  console.log(errorMsg);
              }
        });
    },

    getParticleData: function() {
        var _this = this;
        $.ajax({
              url: 'data/particles.json',
              dataType: 'json',
              success: function(data) {
                  particlesJS('particles-js', data);
                  App.CustomParticles.init();
              },
              error: function(errorMsg) {
                  console.log(errorMsg);
              }
        });
    },

    saveVariables: function() {
        this.scene = $('#scene');
        this.poem  = $('.plant-archive__scene-poem');
        this.icon  = $('.plant-archive__scene-icon');
        this.spec  = $('.plant-archive__scene-spec');
    },

    setParameters: function() {
        this.params = {
            delayBetween: {
                poem: {
                    word: 500
                },
                spec: {
                    section: 2000
                }
            },
            fadeInTime: {
                poem: {
                    word: 750
                },
                icon: {
                    image: 1500
                },
                spec: {
                    section: 1500
                }
            },
            fadeOutTime: {
                scene: 2500
            }
        }
    },

    shuffleScenes: function(scenes) {
        for (var currentIdx = scenes.length - 1; currentIdx > 0; currentIdx--) {
            var randomIdx, currentVal;

            randomIdx = Math.floor(Math.random() * (currentIdx + 1));
            currentVal = scenes[currentIdx];
            
            scenes[currentIdx] = scenes[randomIdx];
            scenes[randomIdx] = currentVal;
        }

        return scenes;
    },

    start: function() {
        this.currentIndex = 0;
        this.drawPlant();
    },

    drawPlant: function() {
        this.clearScene();
        
        var poem = this.scenes[this.currentIndex].poem;
        var icon = this.scenes[this.currentIndex].icon;
        var spec = this.scenes[this.currentIndex].spec;

        console.log('Draw %c' + spec.plant, 'font-weight: bold');        

        this.startScene(poem, icon, spec);
    },

    clearScene: function() {
        this.poem.empty().show();
        this.icon.empty().show();
        this.spec.empty().show();
    },

    startScene: function(poem, icon, spec) {
        this.showIcon(icon);
        this.showText(poem, spec);
    },

    showIcon: function(icon) {
        this.icon.html($('<div>').addClass('icon-' + icon));
        this.icon.children().hide().fadeIn(this.params.fadeInTime.icon.image);
    },

    showText: function(poem, spec) {
        var poemHTML = poem.split(' ').map(function(word) {
            return '<span>' + word + ' ' + '</span>';
        }).join('');

        var specHTML = '';
        specHTML += this.makeSpecSectionHTML('Plant:', spec.plant);
        specHTML += this.makeSpecSectionHTML('Symbolism:', spec.symbolism);
        specHTML += this.makeSpecSectionHTML('Medicinal Use:', spec.usage);
        specHTML += this.makeSpecSectionHTML('Political Pairing:', spec.politics);

        var _this = this;
        this.poem.html(poemHTML).children().hide().each(function(i) {
            $(this).delay(i * _this.params.delayBetween.poem.word).fadeIn(_this.params.fadeInTime.poem.word);
        }).promise().done(function() {
            console.log('Poem completed');
    
            _this.spec.html(specHTML).children().hide().each(function(i) {
                $(this).delay(i * _this.params.delayBetween.spec.section).fadeIn(_this.params.fadeInTime.spec.section);
            }).promise().done(function() {
                console.log('Spec completed')
                
                _this.endScene();
            });
        });
    },

    endScene: function() {
        var _this = this;
        this.scene.children().each(function() {
            $(this).fadeOut(_this.params.fadeOutTime.scene);
        }).promise().done(function() {
            console.log('Scene completed');

            _this.currentIndex = _this.currentIndex + 1 >= _this.scenes.length ? 0 : _this.currentIndex + 1;
            _this.drawPlant();
        });
    },

    makeSpecSectionHTML: function(title, content) {
        return '<div class="section">' + '<div class="title">' + title + '</div>' + '<div class="content">' + content + '</div>' + '</div>'
    }
}

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
                  _this.scenes = data.scenes;
                  _this.drawPlants();
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
                  particlesJS("particles-js", data);
              },
              error: function(errorMsg) {
                  console.log(errorMsg);
              }
        });
    },

    saveVariables: function() {
        this.poem = $('.plant-archive__scene-poem');
        this.icon = $('.plant-archive__scene-icon');
        this.spec = $('.plant-archive__scene-spec');
        this.currentIndex = 0;
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

    drawPlants: function() {
        this.poem.empty().show()
        this.icon.empty().show()
        this.spec.empty().show()

        var poem = this.scenes[this.currentIndex].poem
        var icon = this.scenes[this.currentIndex].icon
        var spec = this.scenes[this.currentIndex].spec

        this.icon.html($('<div>').addClass('icon-' + icon)).children().hide().fadeIn(this.params.fadeInTime.icon.image)

        console.log('Draw %c' + spec.plant, 'font-weight: bold')

        this.poemHTML = poem.split(' ').map(function(word) {
            return '<span>' + word + ' ' + '</span>'
        }).join('')

        this.specHTML = ''
        this.specHTML += this.makeSpecSectionHTML('Plant:', spec.plant)
        this.specHTML += this.makeSpecSectionHTML('Symbolism:', spec.symbolism)
        this.specHTML += this.makeSpecSectionHTML('Medicinal Use:', spec.usage)
        this.specHTML += this.makeSpecSectionHTML('Political Pairing:', spec.politics)

        // https://stackoverflow.com/questions/11637582/fading-a-paragraph-in-word-by-word-using-jquery
        var _this = this;
        this.poem.html(this.poemHTML).children().hide().each(function(i) {
            $(this).delay(i * _this.params.delayBetween.poem.word).fadeIn(_this.params.fadeInTime.poem.word)
        }).promise().done(function() {
            console.log('Poem completed')

            _this.spec.html(_this.specHTML).children().hide().each(function(i) {
                $(this).delay(i * _this.params.delayBetween.spec.section).fadeIn(_this.params.fadeInTime.spec.section)
            }).promise().done(function() {
                console.log('Spec completed')

                $('#scene').children().each(function() {
                    $(this).fadeOut(_this.params.fadeOutTime.scene)
                }).promise().done(function() {
                    console.log('Scene completed')

                    _this.currentIndex = _this.currentIndex + 1 >= _this.scenes.length ? 0 : _this.currentIndex + 1
                    _this.drawPlants()
                    console.log('%casync0', 'color: #aaa')
                });
            });
        });
        console.log('%csync0', 'color: #aaa')
    },

    makeSpecSectionHTML: function(title, content) {
        return '<div class="section">' + '<div class="title">' + title + '</div>' + '<div class="content">' + content + '</div>' + '</div>'
    }
}

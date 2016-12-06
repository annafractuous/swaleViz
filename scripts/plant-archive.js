var plants,
    plantEntryTemplate = $('#plant-archive-entry').html(),
    plantEntryTemplateScript = Handlebars.compile(plantEntryTemplate);

function pullDownMenu() {
  $('.icon-pulldown').click(function() {
    $('.plant-archive').toggleClass('open');
  });
}

function showPlantEntry() {
  $('.plant-archive__menu-icon').click(function() {
    var plant = $(this).attr("data-plant");
    updatePlantEntry(plant);
    $('.plant-archive__menu').hide();
    $('.plant-archive__entry').show();
  });
}

function showArchiveMenu() {
  $('.plant-archive__entry-menu-btn .icon-grid').click(function() {
    $('.plant-archive__entry').hide();
    $('.plant-archive__menu').show();
  });
}

function updatePlantEntry(plant) {
  var plantEntryData = Object.assign({},
    plants[plant],
    {name: plant,
    symbol: "<span class='icon-" + plant + "'></span>",
    source: "<a href='" + plants[plant].source + "' target='_blank'>" + plants[plant].source + "</a>",
    medicinal_use: plants[plant].medicinal_use.join(",</p><p>")}
  );
  var compiledHTML = plantEntryTemplateScript(plantEntryData);
  $('.plant-archive__entry-content').empty();
  $('.plant-archive__entry-content').append(compiledHTML);
}

require(['../data/archive.js'], function(data) {
  plants = data;
});

pullDownMenu();
showPlantEntry();
showArchiveMenu();

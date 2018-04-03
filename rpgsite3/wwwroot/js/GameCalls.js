//Veelgebruikte functies
function hideMainMenu() {
    $("#MainMenu").find('#play').addClass("hidden");
    $("#MainMenu").find('#optionsbtn').addClass("hidden");
    $("#MainMenu").find('#quitmenu').addClass("hidden");
};

function showMainMenu() {
    $("#MainMenu").find('#play').removeClass("hidden");
    $("#MainMenu").find('#optionsbtn').removeClass("hidden");
    $("#MainMenu").find('#quitmenu').removeClass("hidden");
}

//Characters ophalen main menu
function OnGetCharacters(data) {
    //MainMenu verbergen. Characterdingen laten zien.
    hideMainMenu();

    var charactermenu = $("#MainMenu").find('#CharacterMenu');
    charactermenu.prepend(data);
    charactermenu.removeClass("hidden");
};

function OnGetInventory(data) {
    hideMainMenu();

    //Inventory laten zien
    var inventorymenu = $("#MainMenu").find('#inventory');
    inventorymenu.prepend(data);


    
}


$(document).ready(function () {
    //Optionsmenu openen
    $('#optionsbtn').on('click', function () {
        hideMainMenu();

        var optionsmenu = $("#MainMenu").find('#Options');
        optionsmenu.removeClass("hidden");
    });

    $('#backfromoptions').on('click', function () {
        showMainMenu();

        var optionsmenu = $("#MainMenu").find('#Options');
        optionsmenu.addClass("hidden");
    });


    //Back To Menu Knop
    $('body').on('click', '#backtomenu', function () {
        //Charactermenu ui leegmaken.
        var charactermenu = $("#MainMenu").find('#CharacterMenu');
        charactermenu.empty();
        charactermenu.addClass("hidden");

        //Andere ui elementen weer laten zien.
        showMainMenu();
    });

    //Create Character Knop
    $('body').on('click', '#createcharacter', function () {
        console.log("Create character");
    });

/*    $('body').on('click', '.characteroverlay', function () {
        var name = $(this).find(".charactername").text();
        var level = $(this).find(".characterlevel").text();

        
        console.log(window.spelerObject);
    }); */


});
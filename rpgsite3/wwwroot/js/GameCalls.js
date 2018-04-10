//Veelgebruikte functies
function hideMainMenu() {
    $("#MainMenu").find('#play').addClass("hidden");
    $("#MainMenu").find('#optionsbtn').addClass("hidden");
    $("#MainMenu").find('#quitmenu').addClass("hidden");
}

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
    charactermenu.empty();
    charactermenu.prepend(data);
    charactermenu.removeClass("hidden");
}

function OnGetInventory(data) {
    hideMainMenu();

    //Inventory laten zien
    var inventorymenu = $("#MainMenu").find('#inventory');
    inventorymenu.empty();
    inventorymenu.prepend(data);

    //Speler inventory updaten
    window.player.inventory.FillInventory();

    //equipment ophalen
    refreshEquipment();
}

function OnGetEquipment(data) {
    var equipmentmenu = $("#MainMenu").find('#equipment');
    equipmentmenu.empty();
    equipmentmenu.prepend(data);

    //?? misschien
    window.player.inventory.FillEquipment();
    //window.player.inventory.FillEquipment();
}

function onEquipSuccess(data) {
    //item weghalen uit inventory en toevoegen aan equipment
    console.log("Item Equip Status : " + data);

    window.player.inventory.EquipItem(data);
    refreshInventory();
}

function onUseSuccess(data) {
    console.log("Used Item : " + data);
    //item verwijderen uit html en effect toepassen ?? kijken hoe dit werkt

    window.player.inventory.UseItem(data);
    refreshInventory();
}

function onDropSuccess(data) {
    console.log("Dropped Item : " + data);
    //item verwijderen uit inventory

    window.player.inventory.RemoveItem(data);
    refreshInventory();
}

function refreshInventory() {
    var characterName = $("#inventory").find(".gameh1").text().split(" - ")[1];

     $.ajax({
        url: "../Character/GetInventory",
        type: "POST",
        data: { charactername : characterName },
        success: function (data) {
            OnGetInventory(data);
        }
    }); 
}

function refreshEquipment() {
    //Equipment ophalen
    var characterName = $("#inventory").find(".gameh1").text().split(" - ")[1];

    $.ajax({
        url: "../Character/GetEquipment",
        type: "POST",
        data: { charactername: characterName },
        success: function (data) {
            OnGetEquipment(data);
        }
    }); 
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
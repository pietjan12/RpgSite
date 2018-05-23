/* AJAX ONSUCCESS CALLS */

//Characters ophalen main menu
function OnGetCharacters(data) {
    //MainMenu verbergen. Characterdingen laten zien.
    hideMainMenu();

    var charactermenu = $("#MainMenu").find('#CharacterMenu');
    charactermenu.empty();
    charactermenu.prepend(data);
    charactermenu.removeClass("hidden");
}

function OnCreateCharacter(data) {
    var errorLabel = document.getElementById("errorlabel");
    //controleren of character aangemaakt is
    console.log(data);
    if (data === true) {
        //Aangepast
        errorLabel.classList.add("hidden");
        //Gebruikerslist updaten, dit is het makkelijkst door gewoon de juiste knop programmatisch aan te klikken.
        document.getElementById("BackToCharacters").click();
        document.getElementById("backtomenu").click();
        document.getElementById("play").click();
    } else {
        //Niks aangepast
        errorLabel.innerText = "Gebruiker is niet aangemaakt! Gebruikersnaam is mogelijk al bezet.";
        errorLabel.classList.remove("hidden");
    }
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
    //Battle Menu Updaten Voor Character
    refreshBattleMenu();
}

function OnGetEquipment(data) {
    var equipmentmenu = $("#MainMenu").find('#equipment');
    equipmentmenu.empty();
    equipmentmenu.prepend(data);

    //?? misschien
    window.player.inventory.FillEquipment();
    window.player.UpdateStats();
    //window.player.inventory.FillEquipment();
}

function OnGetBattleMenu(data) {
    var battlemenuwrapper = document.getElementById("battlemenu");
    battlemenuwrapper.innerHTML = "";
    battlemenuwrapper.innerHTML = data;
}

function onEquipSuccess(data) {
    window.player.inventory.EquipItem(data);
    refreshInventory();
}

function onUseSuccess(data) {
    window.player.inventory.UseItem(data);
    refreshInventory();
}

function onDropSuccess(data) {
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

function refreshBattleMenu() {
    //skills ophalen
    var characterName = $("#inventory").find(".gameh1").text().split(" - ")[1];

    $.ajax({
        url: "../Character/GetBattleMenu",
        type: "POST",
        data: { charactername: characterName },
        success: function (data) {
            OnGetBattleMenu(data);
        }
    }); 
}
/* AJAX ONSUCCESS CALLS */

/* Veelgebruikte functies */
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
/* Veelgebruikte functies */

/* Click handlers */
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
        //create character knop onzichtbaar maken
        $(this).addClass("hidden");
        //Characterlist en back button verbergen
        $("#characterlist").addClass("hidden");
        $("#backtomenu").addClass("hidden");

        //Wrapper zichtbaar maken
        var characterCreateWrapper = $("#createcharacterwrapper");
        characterCreateWrapper.removeClass("hidden");
    });

    //back to characters knop
    $('body').on('click', '#BackToCharacters', function () {
        //Wrapper onzichtbaar maken
        var characterCreateWrapper = $("#createcharacterwrapper");
        characterCreateWrapper.addClass("hidden");
        //Knop zichtbaar maken
        $("#createcharacter").removeClass("hidden");
        //characterlist en back button zichtbaar maken
        $("#characterlist").removeClass("hidden");
        $("#backtomenu").removeClass("hidden");
    });

    $(document).keydown(function (e) {
        if (e.which === 32 || e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) {
            e.preventDefault();
        }
    });
});
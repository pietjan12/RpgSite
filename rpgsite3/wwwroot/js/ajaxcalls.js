//Geen document ready omdat unobtrusive ajax de functions anders niet kan vinden. Deze zijn in principe toch niet nodig omdat het login scherm pas na het 
//laden van de bootstrap js files etc kan weergeven worden.

//Login ajax posts handlen
function OnStartAjax() {
    //Loading icon laten zien ofzo..
    console.log("Ajax started");

    //Indien nodig error van scherm laten verdwijnen.
    if ($('#login-modal').hasClass('visibleerror')) {
        $('#login-modal').removeClass('visibleerror')
    };

    if ($('#register-modal').hasClass('visibleerror')) {
        $('#register-modal').removeClass('visibleerror')
    };
};

function OnRegisterFailed() {
    var message = $('#register-modal').find('.errormessage');
    message.html("Er ging iets mis. Probeer het later opnieuw!");
    message.addClass("visibleerror");
};

function OnRegisterSuccess(data) {
    //Response opvragen
    var response = $.parseJSON(data);
    if (response === true) {
        //Gebruiker is gecreerd
        //Register modal wegdoen, gebruiker is geregistreerd.
        $('#register-modal').modal('hide');
        //Login modal laten zien zodat de gebruiker meteen kan inloggen.
        $('#login-modal').modal('show');
    } else {
        //Response laten zien dat er iets fout ging.
        var message = $('#register-modal').find('.errormessage');
        message.html("Er ging iets fout. Probeer het opnieuw!");
        message.addClass("visibleerror");
    }
    
};

function OnLoginFailed() {
    var message = $('#login-modal').find('.errormessage');
    message.html("Er ging iets mis. Probeer het later opnieuw!");
    message.addClass("visibleerror");
};

function OnLoginSuccess(data) {
    var response = $.parseJSON(data);
    if (response === true) {
        //Modal wegdoen. Gebruiker is ingelogd.
        $('#login-modal').modal('hide');
        console.log("Login Success");

        //pagina herladen zodat user.identity authenticated wordt.
        location.reload();
    } else {
        //Gebruiker is niet ingelogd, error weergeven.
        var message = $('#login-modal').find('.errormessage');
        message.html("Inloggegevens kloppen niet.");
        message.addClass("visibleerror");
    }
};

function OnLogOutSuccess() {
    //Pagina refreshen
    if (window.location.href.indexOf("Game") > -1) {
        window.location = "/"; 
    } else {
        location.reload();
    }
};

function OnCreateArticleFailed() {

};

function OnCreateArticleSuccess() {

};
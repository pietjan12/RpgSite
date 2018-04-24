﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models;
using Services.Interfaces;
using Api.Models;

namespace rpgsite3.Controllers
{
    public class CharacterController : Controller
    {
        private readonly ICharacterService _CharacterService;

        public CharacterController(ICharacterService characterService)
        {
            _CharacterService = characterService;
        }

        public IActionResult Index(string characterSearch)
        {
            if (!String.IsNullOrEmpty(characterSearch))
            {
                //Er wordt gezocht, juiste model en gegevens meegeven
                var model = new CharacterModel();
                var _Character = _CharacterService.FindCharacterByName(characterSearch, false);
                if (_Character != null)
                {
                    //Alleen equipped dingen meegeven naar character page
                    _Character.inventory = _Character.inventory.Where(i => i.equipped == true).ToList();

                    model.character = _Character;
                    return View(model);
                }
            }
            else if (User.Identity.IsAuthenticated)
            {
                //Er wordt momenteel niet gezocht. Alle characters van ingelogde persoon laten zien in een list.
                //username ophalen vanuit cookie.
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "Username")?.Value;

                if (!String.IsNullOrEmpty(username))
                {
                    var model = new CharacterModel();
                    //Alle characters van deze persoon in de database ophalen
                    var characters = _CharacterService.FindMyCharacters(username);
                    //Controleren of er iets in de list zit.
                    if (characters != null && characters.Count() > 0)
                    {
                        //Model vullen en doorgeven aan view
                        model.foundCharacters = characters;
                        return View(model);
                    }
                }

            }
            //Standaard lege view returnen
            return View();
        }

        //Ophalen alle characters van gebruiker met partialview.
        [HttpPost]
        public IActionResult GetCharacters()
        {
            if (User.Identity.IsAuthenticated)
            {
                //Er wordt momenteel niet gezocht. Alle characters van ingelogde persoon laten zien in een list.
                //username ophalen vanuit cookie.
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "Username")?.Value;

                if (!String.IsNullOrEmpty(username))
                {
                    var model = new CharacterModel();
                    //Alle characters van deze persoon in de database ophalen
                    var characters = _CharacterService.FindMyCharacters(username);
                    //Controleren of er iets in de list zit.
                    if (characters != null && characters.Count() > 0)
                    {
                        //Model vullen en doorgeven aan view
                        model.foundCharacters = characters;
                        return PartialView(model);
                    }
                }
                
            }
            //Standaard lege view returnen
            return null;
        }

        [HttpPost]
        public IActionResult GetInventory(string charactername) {
            if (!string.IsNullOrEmpty(charactername)) {
                var model = new CharacterModel();
                var _MyChosenCharacter = _CharacterService.FindCharacterByName(charactername, true);
                if (_MyChosenCharacter != null) {
                    model.character = _MyChosenCharacter;
                    return View(model);
                }
            }
            return null;
        }

        [HttpPost]
        public IActionResult GetEquipment(string charactername) {
            if(!string.IsNullOrEmpty(charactername)) {
                var model = new CharacterModel();
                var _MyChosenCharacter = _CharacterService.FindCharacterByName(charactername, false);
                if (_MyChosenCharacter != null)
                {
                    model.character = _MyChosenCharacter;
                    return View(model);
                }
            }
            return null;
        }


        // game calls die inventory beinvloeden.
        //TODO MAKEN
        
        //IN DIT GEVAL WORDT HTML.ACTIONLINK GEBRUIKT VOOR DE BUILT-IN OMZETTER VAN COMPLEXE OBJECTEN NAAR PARAMETERS. 
        [HttpPost]
        public IActionResult use(Item myItem)
        {
            bool used = _CharacterService.UseItem(myItem);
            return Json(myItem);
        }

        [HttpPost]
        public IActionResult equip(Item myItem, int characterID)
        {
            _CharacterService.EquipItem(myItem, characterID);

            return Json(myItem);
        }

        [HttpPost]
        public IActionResult drop(Item myItem)
        {
            bool droppedItem = _CharacterService.DropItem(myItem);
            return Json(droppedItem);
        }
    }
}
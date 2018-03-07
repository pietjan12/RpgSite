using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models;
using Services.Interfaces;

namespace rpgsite3.Controllers
{
    public class CharacterController : Controller
    {
        private readonly ICharacterService _CharacterService;

        public CharacterController(ICharacterService characterService)
        {
            _CharacterService = characterService;
        }

        /* TODO FIND INGELOGDE GEBRUIKER ZIJN CHARACTERS */

        /* TODO ECHTE SEARCH BAR TOEVOEGEN VOOR CHARACTER */
        /* TODO TOOLTIP ONHOVER TOEVOEGEN */
        public IActionResult Index()
        {
            var _Character = _CharacterService.FindCharacterByName("bob");

            var model = new CharacterModel()
            {
                character = _Character
            };

            return View(model);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models;
using Services;
using Microsoft.AspNetCore.Authorization;

namespace rpgsite3.Controllers
{
    public class GameController : Controller
    {
        private readonly iEnemyService _EnemyService;

        public GameController(iEnemyService EnemyService)
        {
            _EnemyService = EnemyService;
        }
        public IActionResult Index()
        {
            //Pagina Details goedzetten
            ViewData["Title"] = "Game";
            ViewData["bodyclass"] = "custombg";


            //Enemies opvragen
            var enemiesList = _EnemyService.getAllMonsters();

            var model = new GameIndexModel()
            {
                enemies = enemiesList
            };

            return View(model);
        }
        [Authorize]
        public IActionResult Game()
        {
            ViewData["bodyclass"] = "NoPadding";
            return View();
        }
    }
}
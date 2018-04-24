using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using Services.Interfaces;

namespace rpgsite3.Controllers
{
    public class GameController : Controller
    {
        //Benodigde services
        private readonly iEnemyService _EnemyService;
        //Nodig voor player count weergeven
        private readonly IAccountService _AccountService;

        public GameController(iEnemyService EnemyService, IAccountService AccountService)
        {
            _EnemyService = EnemyService;
            _AccountService = AccountService;
        }
        public IActionResult Index()
        {
            //Pagina Details goedzetten
            ViewData["Title"] = "Game";
            ViewData["bodyclass"] = "custombg";


            //Enemies opvragen
            var enemiesList = _EnemyService.getAllMonsters();

            //Playercounts opvragen
            List<int> TotalPlayersByRole = _AccountService.GetPlayerCountByRole();

            var model = new GameIndexModel()
            {
                enemies = enemiesList,
                NormalPlayerCount = TotalPlayersByRole[0],
                AdminPlayerCount = TotalPlayersByRole[1]
                
            };

            return View(model);
        }
        [Authorize]
        public IActionResult Game()
        {
            ViewData["bodyclass"] = "NoPadding";
            return View();
        }

        public IActionResult GetRandomMonsters() {

            var generatedEnemies = _EnemyService.GenerateMonsters();
            return Json(generatedEnemies);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models;
using Services.Interfaces;

namespace rpgsite3.Controllers
{
    public class HomeController : Controller
    {
        private readonly INewsService _NewsService;

        public HomeController(INewsService NewsService)
        {
            _NewsService = NewsService;
        }

        public IActionResult Index()
        {
            ViewData["Title"] = "Home Page";
          
            //Nieuws ophalen
            var NewsList = _NewsService.GetAllNews();

            var model = new NewsModel()
            {
                News = NewsList.ToList()
            };

            return View(model);
        }

       

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

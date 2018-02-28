using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using rpgsite3.Models;

namespace rpgsite3.Controllers
{
    public class NewsController : Controller
    {
        private readonly INewsService _NewsService;

        public NewsController(INewsService NewsService)
        {
            _NewsService = NewsService;
        }
        public IActionResult Index()
        {
            ViewData["Title"] = "News";

            var NewsList = _NewsService.GetAllNews();

            var model = new NewsModel()
            {
                News = NewsList.ToList()
            };

            return View(model);
        }

        public IActionResult News(int id)
        {
            ViewData["Title"] = "News";

            var NewsList = _NewsService.FindNewsById(id);

            var model = new NewsModel()
            {
                News = NewsList.ToList()
            };

            return View(model);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using rpgsite3.Models;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Api.Models;

namespace rpgsite3.Controllers
{
    public class NewsController : Controller
    {
        private readonly INewsService _NewsService;
        private readonly IHostingEnvironment _hostingEnviroment;

        public NewsController(IHostingEnvironment hostingEnviroment , INewsService NewsService)
        {
            _NewsService = NewsService;
            _hostingEnviroment = hostingEnviroment;
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

            var article = _NewsService.FindNewsById(id);

            var model = new NewsModel();
            //artikel toevoegen
            model.News.Add(article);

            return View(model);
        }

        [Authorize]
        public IActionResult Dashboard()
        {
            var NewsList = _NewsService.GetAllNews();

            var model = new NewsModel()
            {
                News = NewsList.ToList()
            };
            //Dashboard laten zien

            return View(model);
        }

        [Authorize]
        public IActionResult AddArticle(int? id)
        {
            //Controleren of we een bestaand artikel gaan aanpassen
            if(id != null)
            {
                //Int converteren naar gewone type int.
                var NewsArticle = _NewsService.FindNewsById(Convert.ToInt32(id));

                var model = new NewsModel();
                model.News.Add(NewsArticle);

                return View(model);
            }
            //Dashboard laten zien
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult CreateArticle(string title, string text, IFormFile file)
        {
            if (!String.IsNullOrEmpty(title) || !String.IsNullOrEmpty(text))
            {
                //Foto uploaden naar wwwroot.
                var newFileName = "";

                if (file != null)
                {
                    var filename = "";
                    var pathToImage = "";

                    if (file.Length > 0)
                    {
                        filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var UniqueFilePart = Guid.NewGuid().ToString();

                        var fileExtension = Path.GetExtension(filename);

                        newFileName = UniqueFilePart + fileExtension;

                        filename = Path.Combine(_hostingEnviroment.WebRootPath, "Images/NewsImages") + $@"\{newFileName}";

                        pathToImage = "Images/NewsImages/" + newFileName;

                        using (FileStream fs = System.IO.File.Create(filename))
                        {
                            file.CopyTo(fs);
                            fs.Flush();
                        }
                        
                        //Toevoegen aan database
                        _NewsService.CreateArticle(title, text, pathToImage);
                    }
                }
            }

            return RedirectToAction("News", "News");
        }
        
        [Authorize]
        [HttpPost]
        public IActionResult EditArticle(int id, string title, string text, IFormFile file)
        {
            if (!String.IsNullOrEmpty(title) || !String.IsNullOrEmpty(text))
            {
                //Indien nieuwe foto geupload is, foto uploaden.
                var newFileName = "";
                if (file != null)
                {
                    var filename = "";
                    var pathToImage = "";

                    if (file.Length > 0)
                    {
                        filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var UniqueFilePart = Guid.NewGuid().ToString();

                        var fileExtension = Path.GetExtension(filename);

                        newFileName = UniqueFilePart + fileExtension;

                        filename = Path.Combine(_hostingEnviroment.WebRootPath, "Images/NewsImages") + $@"\{newFileName}";

                        pathToImage = "Images/NewsImages/" + newFileName;

                        using (FileStream fs = System.IO.File.Create(filename))
                        {
                            file.CopyTo(fs);
                            fs.Flush();
                        }

                        //Toevoegen aan database
                        _NewsService.EditArticle(id, title, text, pathToImage);
                        //Terug naar dashboard
                        return RedirectToAction("Dashboard", "News");
                    }
                }

                //Alleen tekst aanpassen
                _NewsService.EditArticle(id, title, text, null);
            }

            return RedirectToAction("Dashboard", "News");
        }
    }
}
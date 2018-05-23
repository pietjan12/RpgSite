using Api.Models;
using Data.Contexts;
using Data.Factory;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RpgSite3.Tests
{
    [TestClass]
    public class NewsTests
    {
        private INewsFactory _NewsFactory;
        private INewsContext _NewsContext;

        public NewsTests()
        {
            var services = new ServiceCollection();
            //Transient zodat deze per methode refresht
            services.AddTransient<INewsContext, NewsMemoryContext>();
            var serviceProvider = services.BuildServiceProvider();

            _NewsFactory = new NewsFactory(serviceProvider);
            //MEMORY CONTEXT
            _NewsContext = _NewsFactory.ChangeType(StorageType.Memory);
        }

        [TestMethod]
        public void TestCreateArticleValidParameters()
        {
            string title = "Nieuws Titel";
            string text = "Nieuws Tekst";
            string img_loc = "";
            string username = "admin";

            bool CreatedArticle = _NewsContext.CreateArticle(title, text, img_loc, username);
            Assert.AreEqual(true, CreatedArticle);
        }

        [TestMethod]
        public void TestCreateArticleNonValidParameters()
        {
            //Artikel zou gewoon gecreert moeten worden met de null parameter.
            //een typfout mag niet zorgen dat het artikel niet gepublished wordt / de applicatie crasht.
            string title = "Nieuws Titel";
            string text = null;
            string img_loc = "";
            string username = "admin";

            bool CreatedArticle = _NewsContext.CreateArticle(title, text, img_loc, username);
            Assert.AreEqual(true, CreatedArticle);
        }

        [TestMethod]
        public void TestEditArticleValidParameters()
        {
            //id wordt geauto increment. is dus 1.
            string title = "Test Artikel";
            string text = "Dit is een test";
            string img_loc = "";
            string username = "admin";

            _NewsContext.CreateArticle(title, text, img_loc, username);

            bool EditedArticle = _NewsContext.EditArticle(1, "Test Artikel Aangepast!", "Goedendag", "");
            Assert.AreEqual(true, EditedArticle);
        }

        [TestMethod]
        public void TestEditArticleNonExistingArticle()
        {
            bool EditedArticle = _NewsContext.EditArticle(1, "Artikel Aangepast?", "Goedendag!", "");
            Assert.AreEqual(false, EditedArticle);
        }

        [TestMethod]
        public void TestGetArticleByIDValidID()
        {
            News article = _NewsContext.GetByID(0);
            Assert.AreEqual("TEST", article.Title);
        }

        [TestMethod]
        public void TestGetArticleByIDInvalidID()
        {
            News article = _NewsContext.GetByID(1);
            Assert.AreEqual(null, article);
        }

        [TestMethod]
        public void TestGetAllNews()
        {
            IEnumerable<News> Articles = _NewsContext.GetAll();
            Assert.AreEqual(1, Articles.Count());
        }
    }
}

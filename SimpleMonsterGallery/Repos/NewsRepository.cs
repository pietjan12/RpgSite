using Api.Models;
using Data.Contexts;
using Data.Factory.Interface;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class NewsRepository : INewsRepository
    {
        private INewsFactory _contextFactory;
        private INewsContext _context;

        public NewsRepository(INewsFactory contextFactory)
        {
            _contextFactory = contextFactory;
            //Standaard SQL initialiseren
            _context = _contextFactory.ChangeType(StorageType.Sql);
        }

        public bool CreateArticle(string Title, string text, string img_loc, string username)
        {
            return _context.CreateArticle(Title, text, img_loc, username);
        }

        public bool EditArticle(int id, string Title, string text, string img_loc)
        {
            return _context.EditArticle(id, Title, text, img_loc);
        }

        public IEnumerable<News> GetAll()
        {
            return _context.GetAll();
        }

        public IEnumerable<News> GetByID(int id)
        {
            return _context.GetByID(id);
        }
    }
}

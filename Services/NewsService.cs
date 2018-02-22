using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Data.Models;
using Data.Interfaces;

namespace Services
{
    public class NewsService : INewsService
    {
        private readonly INews _context;
        
        public NewsService(INews context)
        {
            _context = context;
        }
        public IEnumerable<News> FindNewsById(int id)
        {
            return _context.GetByID(id);
        }

        public IEnumerable<News> GetAllNews()
        {
            return _context.GetAll();
        }
    }
}

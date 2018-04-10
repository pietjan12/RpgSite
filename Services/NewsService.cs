using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Linq;
using Data.Repos.Interfaces;

namespace Services
{
    public class NewsService : INewsService
    {
        private readonly INewsRepository _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NewsService(INewsRepository context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public bool CreateArticle(string title, string text, string img_loc)
        {
            string username = getUsername();
            if(username != null)
            {
                return _context.CreateArticle(title, text, img_loc, username);
            }
            return false;
        }

        public bool EditArticle(int id, string title, string text, string img_loc)
        {
            return _context.EditArticle(id, title, text, img_loc);
        }

        public IEnumerable<News> FindNewsById(int id)
        {
            return _context.GetByID(id);
        }

        public IEnumerable<News> GetAllNews()
        {
            return _context.GetAll();
        }

        private string getUsername()
        {
            var identity = (ClaimsIdentity)_httpContextAccessor.HttpContext.User.Identity;
            string username = identity.Claims.FirstOrDefault(u => u.Type == "Username").Value;
            if(!string.IsNullOrEmpty(username))
            {
                return username;
            }
            return null;
        }
    }
}

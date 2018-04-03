using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Api.Interfaces
{
    public interface INews
    {
        IEnumerable<News> GetAll();
        IEnumerable<News> GetByID(int id);

        bool CreateArticle(String Title, String text, String img_loc, string username);
        bool EditArticle(int id, String Title, String text, String img_loc);
    }
}

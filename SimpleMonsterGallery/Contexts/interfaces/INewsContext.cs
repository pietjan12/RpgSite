using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public interface INewsContext
    {
        IEnumerable<News> GetAll();
        News GetByID(int id);

        bool CreateArticle(String Title, String text, String img_loc, string username);
        bool EditArticle(int id, String Title, String text, String img_loc);
    }
}

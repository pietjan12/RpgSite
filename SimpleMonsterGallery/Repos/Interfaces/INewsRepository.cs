using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos.Interfaces
{
    //gebruik maken van een interface voor repository zodat dependency injection gebruikt kan worden.
    public interface INewsRepository
    {
        IEnumerable<News> GetAll();
        IEnumerable<News> GetByID(int id);

        bool CreateArticle(String Title, String text, String img_loc, string username);
        bool EditArticle(int id, String Title, String text, String img_loc);
    }
}

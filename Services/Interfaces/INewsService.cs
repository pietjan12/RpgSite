using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Services.Interfaces
{
    public interface INewsService
    {
        IEnumerable<News> GetAllNews();
        News FindNewsById(int id);
        bool CreateArticle(String title, String text, String img_loc);
        bool EditArticle(int id, String title, String text, String img_loc);
        void ChangeType(StorageType type);
    }
}

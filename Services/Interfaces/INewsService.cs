using Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface INewsService
    {
        IEnumerable<News> GetAllNews();
        IEnumerable<News> FindNewsById(int id);
    }
}

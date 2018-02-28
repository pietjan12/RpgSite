using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Services.Interfaces
{
    public interface INewsService
    {
        IEnumerable<News> GetAllNews();
        IEnumerable<News> FindNewsById(int id);
    }
}

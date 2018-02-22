using System;
using System.Collections.Generic;
using System.Text;
using Data.Models;

namespace Data.Interfaces
{
    public interface INews
    {
        IEnumerable<News> GetAll();
        IEnumerable<News> GetByID(int id);

    }
}

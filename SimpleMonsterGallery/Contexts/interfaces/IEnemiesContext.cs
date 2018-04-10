using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Contexts
{
    //Repository Context
    public interface IEnemiesContext
    {
        IEnumerable<Monster> getAll();
        IEnumerable<Monster> getByName(String name);

    }
}

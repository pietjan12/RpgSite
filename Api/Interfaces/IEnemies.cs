using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Interfaces
{
    //Repository Context
    public interface IEnemies
    {
        IEnumerable<Monster> getAll();
        IEnumerable<Monster> getByName(String name);

    }
}

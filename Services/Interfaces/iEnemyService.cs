using System;
using System.Collections.Generic;
using Data.Models;
using System.Text;

namespace Services
{
    public interface iEnemyService
    {
        IEnumerable<Monster> getAllMonsters();
        IEnumerable<Monster> findMonsterByName(String name);
    }
}

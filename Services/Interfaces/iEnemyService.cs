using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Services
{
    public interface iEnemyService
    {
        IEnumerable<Monster> getAllMonsters();
        IEnumerable<Monster> findMonsterByName(String name);

        IEnumerable<Monster> GenerateMonsters();
    }
}

using System;
using System.Collections.Generic;
using Api.Models;
using Api.Interfaces;
using System.Linq;

namespace Services
{
    //IF1RepositorySqlContext
    public class EnemyService : iEnemyService
    {
        private readonly IEnemies _context;

        public EnemyService(IEnemies context)
        {   
            _context = context;
        }

        public IEnumerable<Monster> findMonsterByName(string name)
        {
            //EVT check toevoegen voor lege lijst.
            return _context.getByName(name);
        }

        public IEnumerable<Monster> getAllMonsters()
        {
            return _context.getAll();
        }
    }
}

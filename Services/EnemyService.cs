using System;
using System.Collections.Generic;
using Api.Models;
using System.Linq;
using Data.Repos.Interfaces;

namespace Services
{
    //IF1RepositorySqlContext
    public class EnemyService : iEnemyService
    {
        private readonly IEnemyRepository _context;

        public EnemyService(IEnemyRepository context)
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

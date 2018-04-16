using Api.Models;
using Data.Contexts;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class EnemiesRepository : IEnemyRepository
    {
        private IEnemiesContext _context;

        public EnemiesRepository(IEnemiesContext context)
        {
            _context = context;
        }

        public IEnumerable<Monster> GenerateMonsters(int numberOfMonsters)
        {
            return _context.GenerateMonsters(numberOfMonsters);
        }

        public IEnumerable<Monster> getAll()
        {
            return _context.getAll();
        }

        public IEnumerable<Monster> getByName(string name)
        {
            return _context.getByName(name);
        }
    }
}

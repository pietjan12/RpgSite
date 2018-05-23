using Api.Models;
using Data.Contexts;
using Data.Factory.Interface;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class EnemiesRepository : IEnemyRepository
    {
        private IEnemiesFactory _contextFactory;
        private IEnemiesContext _context;

        public EnemiesRepository(IEnemiesFactory contextFactory)
        {
            _contextFactory = contextFactory;
            //standaard sql initialiseren
            ChangeType(StorageType.Sql);
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
        public void ChangeType(StorageType type)
        {
            _context = _contextFactory.ChangeType(type);
        }
    }
}

using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos.Interfaces
{
    //gebruik maken van een interface voor repository zodat dependency injection gebruikt kan worden.
    public interface IEnemyRepository
    {
        IEnumerable<Monster> getAll();
        IEnumerable<Monster> getByName(String name);
        IEnumerable<Monster> GenerateMonsters(int numberOfMonsters);
        void ChangeType(StorageType type);
    }
}

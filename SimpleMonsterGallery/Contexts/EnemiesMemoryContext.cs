using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public class EnemiesMemoryContext : IEnemiesContext
    {
        private List<Monster> monsters { get; set; }

        public EnemiesMemoryContext()
        {
            monsters = new List<Monster>();

            Monster m = new Monster();
            m.Id = 1;
            m.image_url = "";
            m.name = "Goblin";
            m.story = "Unrelevant";


            Monster m2 = new Monster();
            m.Id = 2;
            m.image_url = "";
            m.name = "Wizard";
            m.story = "Unrelevant";


            Monster m3 = new Monster();
            m.Id = 3;
            m.image_url = "";
            m.name = "Troll";
            m.story = "Unrelevant";

            Monster m4 = new Monster();
            m.Id = 4;
            m.image_url = "";
            m.name = "Ghost";
            m.story = "Unrelevant";


            //Monsters toevoegen aan list.
            monsters.Add(m);
            monsters.Add(m2);
            monsters.Add(m3);
            monsters.Add(m4);
        }

        public IEnumerable<Monster> GenerateMonsters(int numberOfMonsters)
        {
            Random r = new Random();

            List<Monster> randomMonsters = new List<Monster>();

            for (int i = 0; i < numberOfMonsters; i++)
            {
                int randomInt = r.Next(monsters.Count);
                //Random monster toevoegen aan temp list.
                randomMonsters.Add(monsters[randomInt]);
            }

            return randomMonsters;
        }

        public IEnumerable<Monster> getAll()
        {
            return monsters;
        }

        public IEnumerable<Monster> getByName(string name)
        {
            return monsters.Where(m => m.name == name);
        }
    }
}

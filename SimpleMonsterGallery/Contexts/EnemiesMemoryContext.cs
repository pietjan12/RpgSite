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
            m2.Id = 2;
            m2.image_url = "";
            m2.name = "Wizard";
            m2.story = "Unrelevant";


            Monster m3 = new Monster();
            m3.Id = 3;
            m3.image_url = "";
            m3.name = "Troll";
            m3.story = "Unrelevant";

            Monster m4 = new Monster();
            m4.Id = 4;
            m4.image_url = "";
            m4.name = "Ghost";
            m4.story = "Unrelevant";


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

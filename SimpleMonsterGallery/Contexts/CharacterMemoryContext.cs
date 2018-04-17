using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public class CharacterMemoryContext : ICharacterContext
    {
        //Gebruikers tabel voor mock koppeling gebruikers en characters op basis van user id. is nodig voor de findmycharacters methode.
        private List<Gebruiker> users { get; set; }

        private List<Character> Characters { get; set; }

        public CharacterMemoryContext()
        {
            users = new List<Gebruiker>();
            Characters = new List<Character>();
            //testdata initialiseren
            //USERS
            Gebruiker g = new Gebruiker();
            g.user_id = 1;
            g.username = "TestBoi69";
            g.password = "SecurePassword";
            g.admin = true;

            Gebruiker g2 = new Gebruiker();
            g.user_id = 2;
            g.username = "pieterke";
            g.password = "password";
            g.admin = false;

            users.Add(g);
            users.Add(g2);

            AddCharacters(4);
        }

        private void AddCharacters(int amount)
        {
            Random r = new Random();

            for(int i = 0; i < amount; i++)
            {
                //CHARACTERS
                Character c = new Character();
                c.id = users.Count + 1;
                c.naam = "pieterke" + i;
                c.level = r.Next(1, 10);
                c.intelligence = 10;
                c.strength = 10;
                c.userID = r.Next(1, 3);
                c.inventory = new List<Item>();

                //ITEMS TOEVOEGEN AAN CHARACTER INVENTORY
                Item item = new Item();
                item.id = c.inventory.Count + 1;
                item.category = 1;
                item.img_loc = "";
                item.intelligence = 6;
                item.strength = 6;
                item.Rarity = Rarity.Common;
                item.name = "Wooden Sword";
                item.equipped = false;

                //Toevoegen aan list.
                c.inventory.Add(item);

                Item i2 = new Item();
                i2.id = c.inventory.Count + 1;
                i2.category = 1;
                i2.img_loc = "";
                i2.intelligence = 4;
                i2.strength = 4;
                i2.Rarity = Rarity.Common;
                i2.name = "Iron Sword";
                i2.equipped = false;

                //toevoegen aan list
                c.inventory.Add(i2);

                Characters.Add(c);
            }
        }

        public Character FindCharacterByName(string naam)
        {
            return Characters.FirstOrDefault(i => i.naam == naam);
        }

        public List<Character> FindMyCharacters(string username)
        {
            //userid opvragen van gebruiker
            Gebruiker user = users.FirstOrDefault(u => u.username == username);
            if(user != null)
            {
                return Characters.Where(i => i.userID == user.user_id).ToList();
            }
            //standaard null returnen
            return null;
        }

        public bool EquipItem(Item item, int characterID)
        {
            Character character = Characters.Where(i => i.id == characterID && i.inventory.Contains(item)).First();
            if(character != null)
            {
                //we weten dat de item in de inventory zit.
                Item i = character.inventory.Find(inventoryitem => inventoryitem.id == item.id);
                //boolean flippen
                i.equipped = !i.equipped;

                return true;
            }
            //niet gelukt
            return false;
        }


        //ZIJN NOG NIET GEMAAKT IN SQL VERSIE.
        public bool DropItem(Item item)
        {
            throw new NotImplementedException();
        }

        public bool UseItem(Item item)
        {
            throw new NotImplementedException();
        }
    }
}

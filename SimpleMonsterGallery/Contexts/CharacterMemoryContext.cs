using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public class CharacterMemoryContext : ICharacterContext
    {
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
            g2.user_id = 2;
            g2.username = "pieterke";
            g2.password = "password";
            g2.admin = false;

            Gebruiker g3 = new Gebruiker();
            g3.user_id = 3;
            g3.username = "TestBoi70";
            g3.password = "SecurePassword";
            g3.admin = false;

            users.Add(g);
            users.Add(g2);
            users.Add(g3);

            AddCharacters(4);
        }

        private void AddCharacters(int amount)
        {
            Random r = new Random();

            for(int i = 0; i < amount; i++)
            {
                int userid = 1;
                //Even getal
                if(i % 2 != 0)
                {
                    //oneven getal
                    userid = 2;
                }

                //CHARACTERS
                Character c = new Character();
                c.id = Characters.Count + 1;
                c.naam = "pieterke" + i;
                c.level = r.Next(1, 10);
                c.intelligence = 10;
                c.strength = 10;
                c.userID = userid;
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

                if(userid == 2)
                {
                    Item i3 = new Item();
                    i3.id = c.inventory.Count + 1;
                    i3.category = 1;
                    i3.img_loc = "";
                    i3.intelligence = 4;
                    i3.strength = 4;
                    i3.Rarity = Rarity.Common;
                    i3.name = "Steel Sword";
                    i3.equipped = false;
                }

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
            Character character = Characters.Where(c => c.id == characterID && c.inventory.Exists(i => i.id == item.id && i.name == item.name)).First();
            if(character != null)
            {
                //we weten dat de item in de inventory zit.
                Item i = character.inventory.Find(inventoryitem => inventoryitem.id == item.id && inventoryitem.name == item.name);
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

        //TODO : OOK NOG MAKEN VOOR SQLCONTEXT EN IMPLEMENTEREN IN GAME
        private bool AddCharacter(int userid, string charactername)
        {
            Gebruiker user = users.Find(u => u.user_id == userid);

            Character c = new Character();
            c.naam = charactername;
            c.level = 1;
            c.intelligence = 10;
            c.strength = 10;
            c.userID = user.user_id;


            return false;
        }
    }
}

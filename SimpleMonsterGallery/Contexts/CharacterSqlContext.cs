using Data.Contexts;
using Api.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Data.SqlClient;

namespace Data
{
    public class CharacterSqlContext : ICharacterContext
    {
        private string ConnectionString;

        public CharacterSqlContext(IConfiguration config)
        {
            this.ConnectionString = config["Data:TestConnection"];
        }

        public Character FindCharacterByName(string naam)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "TestGetCharacter";
                var results = db.QueryMultiple(sQuery, new { CharacterName = naam }, commandType: CommandType.StoredProcedure);

                Character character = results.Read<Character>().Distinct().FirstOrDefault();
                if (character != null)
                {
                    var Consumables = results.Read<Consumable>();
                    var Equippables = results.Read<Equippable>();

                    character.inventory.AddRange(Equippables);
                    character.inventory.AddRange(Consumables);
                    character.skills = results.Read<Skill>().Distinct().ToList();

                    //Alle item acties opvragen
                    string sQuery2 = "GetActions";
                    foreach (Item item in character.inventory) {
                        item.actions = db.Query<String>(sQuery2, new { categoryid = item.category }, commandType: CommandType.StoredProcedure).ToList();
                    }
                }

                return character;
            }
        }

        public List<Character> FindMyCharacters(string username)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetMyCharacters";
                
                List<Character> characters = db.Query<Character>(sQuery, new { gebruiker = username },commandType: CommandType.StoredProcedure).AsList();

                return characters;
            }
        }

        /* GAME PARAMETERS */
        public bool UseItem(Item item)
        {
            //Item verwijderen van speler
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "RemoveItem";
                var changedRows = db.Execute(sQuery, new { id = item.id}, commandType: CommandType.StoredProcedure);

                if(changedRows > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DropItem(Item item)
        {
            using (IDbConnection db = OpenConnection())
            {
                //Item verwijderen
                string sQuery = "RemoveItem";
                var changedRows = db.Execute(sQuery, new { id = item.id }, commandType: CommandType.StoredProcedure);

                if (changedRows > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool EquipItem(Equippable item, int characterID)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "EquipItem";
                var changedRows = db.Execute(sQuery, new { id = item.id, equip = !item.equipped, item.category, characterid = characterID }, commandType: CommandType.StoredProcedure);

                if (changedRows > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool AddCharacter(string username, string charactername)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "AddCharacter";
                var count = db.Execute(sQuery, new { username, charactername }, commandType: CommandType.StoredProcedure);

                if(count > 0)
                {
                    //rij is aangemaakt
                    return true;
                }
            }

                return false;
        }

        public bool GenerateItems(int characterID)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GenerateItems";
                var changedRows = db.Execute(sQuery, new { characterID }, commandType: CommandType.StoredProcedure);
                  
                if(changedRows > 0)
                {
                    return true;
                }

                return false;
            }
        }

        private SqlConnection OpenConnection()
        {
            return new SqlConnection(ConnectionString);
        }
    }
}

using Api.Interfaces;
using Api.Models;
using Dapper;
using Data.Base;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Data
{
    public class CharacterRepository : BaseRepo, ICharacter
    {
        public CharacterRepository(IConfiguration config) : base(config)
        {

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
                    character.inventory = results.Read<Item>().Distinct().ToList();
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
                var changedRows = db.Execute(sQuery, new { id = item.id }, commandType: CommandType.StoredProcedure);

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
                
            }
            return true;
        }

        public bool EquipItem(Item item)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "EquipItem";
                var changedRows = db.Execute(sQuery, new { id = item.id, equip = !item.equipped, item.category }, commandType: CommandType.StoredProcedure);

                if (changedRows > 0)
                {
                    return true;
                }
            }
            return false;
        }
    }
}

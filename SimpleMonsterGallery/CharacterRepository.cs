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

                Character character = results.Read<Character>().Distinct().First();
                character.inventory = results.Read<Item>().Distinct().ToList();
                character.skills = results.Read<Skill>().Distinct().ToList();

                return character;
            }
        }

        /* TODO FIND MY CHARACTERS */
        public Character FindMyCharacters(int user_ID)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetMyCharacter";
                return null;
                //return db.Query<Character, Item, Character>(sQuery, (character,item) => { character.inventory.Add(item); return character; }, new { userid = user_ID }, splitOn: "user_id", commandType: CommandType.StoredProcedure).AsList();
            }
        }
            
    }
}

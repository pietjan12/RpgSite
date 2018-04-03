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
            
    }
}

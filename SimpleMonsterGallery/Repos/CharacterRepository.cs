using Api.Models;
using Data.Contexts;
using Data.Factory.Interface;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class CharacterRepository : ICharacterRepository
    {
        private ICharacterFactory _contextFactory;
        private ICharacterContext _context;

        public CharacterRepository(ICharacterFactory contextFactory)
        {
            _contextFactory = contextFactory;
            //standaard sql initialiseren
            ChangeType(StorageType.Sql);
        }

        public bool AddCharacter(string username, string charactername)
        {
            return _context.AddCharacter(username, charactername);
        }

        public bool DropItem(Item item)
        {
            return _context.DropItem(item);
        }

        public bool EquipItem(Equippable item, int characterID)
        {
            return _context.EquipItem(item, characterID);
        }

        public Character FindCharacterByName(string naam)
        {
            return _context.FindCharacterByName(naam);
        }

        public List<Character> FindMyCharacters(string username)
        {
            return _context.FindMyCharacters(username);
        }

        public bool GenerateItems(int characterID)
        {
            return _context.GenerateItems(characterID);
        }

        public bool UseItem(Item item)
        {
            return _context.UseItem(item);
        }
        public void ChangeType(StorageType type)
        {
            _context = _contextFactory.ChangeType(type);
        }
    }
}

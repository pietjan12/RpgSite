using Api.Models;
using Data.Contexts;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class CharacterRepository : ICharacterRepository
    {
        private ICharacterContext _context;

        public CharacterRepository(ICharacterContext context)
        {
            _context = context;
        }

        public bool DropItem(Item item)
        {
            return _context.DropItem(item);
        }

        public bool EquipItem(Item item, int characterID)
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

        public bool UseItem(Item item)
        {
            return _context.UseItem(item);
        }
    }
}

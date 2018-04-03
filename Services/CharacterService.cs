using Api.Interfaces;
using Api.Models;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacter _context;

        public CharacterService(ICharacter context)
        {
            _context = context;
        }

        public Character FindCharacterByName(string name)
        {
            Character character = _context.FindCharacterByName(name);

            if (character != null)
            {
                //Controleren of er voldoende items in de inventory zitten om te laten zien op de character page, anders vullen met empty slots.
                while (character.inventory.Count < 10)
                {
                    //Placeholder item aanmaken
                    Item i = new Item();
                    i.name = "Empty Slot";
                    i.description = "An Empty Slot";
                    i.Rarity = Rarity.Common;
                    i.img_loc = "emptyslot.png";
                    //Item toevoegen aan inventory
                    character.inventory.Add(i);
                }
            }

            return character;
        }

        public List<Character> FindMyCharacters(string username)
        {
            return _context.FindMyCharacters(username);
        }
    }
}

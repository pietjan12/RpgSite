using Api.Models;
using Data.Repos.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacterRepository _context;

        public CharacterService(ICharacterRepository context)
        {
            _context = context;
        }

        public Character FindCharacterByName(string name, bool FillInventorySlots)
        {
            Character character = _context.FindCharacterByName(name);

            if (character != null)
            {
                if (FillInventorySlots)
                {
                    //Controleren of er voldoende items in de inventory zitten om te laten zien op de character page, anders vullen met empty slots.
                    while (character.inventory.FindAll(i => i.equipped == false).Count < 15)
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
            }

            return character;
        }

        public List<Character> FindMyCharacters(string username)
        {
            return _context.FindMyCharacters(username);
        }

        /* GAME CALLS */
        public bool DropItem(Item item)
        {
            return _context.DropItem(item);
        }

        public bool EquipItem(Item item, int characterID)
        {
            bool ChangedEquip = _context.EquipItem(item, characterID);
            if(ChangedEquip)
            {
                //Equipstatus flippen.
                item.equipped = !item.equipped;
                return true;
            }
            return false;
        }

        public bool UseItem(Item item)
        {
            return _context.UseItem(item);
        }
    }
}

using Api.Models;
using Data.Repos.Interfaces;
using Microsoft.AspNetCore.Http;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Services
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacterRepository _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CharacterService(ICharacterRepository context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public Character FindCharacterByName(string name, bool FillInventorySlots)
        {
            Character character = _context.FindCharacterByName(name);

            if (character != null)
            {
                if (FillInventorySlots)
                {
                    //Controleren of er voldoende items in de inventory zitten om te laten zien op de character page, anders vullen met empty slots.
                    var EquippablesInInventory = character.inventory.OfType<Equippable>().Where(i => i.equipped == false).ToList();
                    var ConsumablesInInventory = character.inventory.OfType<Consumable>().ToList();
                    while (((EquippablesInInventory.Count + ConsumablesInInventory.Count) < 15))
                    {
                        //Placeholder item aanmaken
                        Equippable i = new Equippable();
                        i.name = "Empty Slot";
                        i.description = "An Empty Slot";
                        i.Rarity = Rarity.Common;
                        i.img_loc = "emptyslot.png";

                        //Toevoegen aan equippables zodat we uit while loop komen
                        EquippablesInInventory.Add(i);
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

        public bool AddCharacter(string charactername)
        {
            string username = getUsername();
            if(username != null)
            {
                //Controleren of gebruiker al bestaat, indien deze al bestaat blokkeren, gebruikersnaam kan maar 1x gebruikt worden.
                Character existingChar = FindCharacterByName(charactername, false);
                if (existingChar == null)
                {
                    return _context.AddCharacter(username, charactername);
                }
            }
            return false;
        }

        /* GAME CALLS */
        public bool DropItem(Item item)
        {
            return _context.DropItem(item);
        }

        public bool EquipItem(Equippable item, int characterID)
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

        private string getUsername()
        {
            var identity = (ClaimsIdentity)_httpContextAccessor.HttpContext.User.Identity;
            string username = identity.Claims.FirstOrDefault(u => u.Type == "Username").Value;
            if (!string.IsNullOrEmpty(username))
            {
                return username;
            }
            return null;
        }

        public bool generateVictoryItems(int characterID)
        {
            //Integer om bij te houden hoeveel we eventueel moeten genereren.
            int AmountToGenerate = 0;

            //Kijken of we een item moeten genereren
            Random r = new Random();
            int value = r.Next(0, 100);
            if (value > 65)
            {
                if(value > 85)
                {
                    //dubbele items
                    AmountToGenerate = 2;
                } else
                {
                    //Single items
                    AmountToGenerate = 1;
                }

                for(int i = 0; i < AmountToGenerate; i++)
                {
                    _context.GenerateItems(characterID);
                }

                return true;
            }
            //Niks gewonnen helaas.
            return false;
        }
        public void ChangeType(StorageType type)
        {
            _context.ChangeType(type);
        }
    }
}

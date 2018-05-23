using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ICharacterService
    {
        List<Character> FindMyCharacters(string username);
        Character FindCharacterByName(String name, bool FillInventorySlots);
        bool AddCharacter(string charactername);
        bool UseItem(Item item);
        bool EquipItem(Equippable item, int characterID);
        bool DropItem(Item item);
        bool generateVictoryItems(int characterID);
        void ChangeType(StorageType type);
    }
}

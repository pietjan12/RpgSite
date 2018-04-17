using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public interface ICharacterContext
    {
        List<Character> FindMyCharacters(string username);
        Character FindCharacterByName(String naam);
        bool UseItem(Item item);
        bool EquipItem(Item item, int characterID);
        bool DropItem(Item item);
    }
}

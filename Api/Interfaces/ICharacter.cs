using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Api.Interfaces
{
    public interface ICharacter
    {
        List<Character> FindMyCharacters(string username);
        Character FindCharacterByName(String naam);
        bool UseItem(Item item);
        bool EquipItem(Item item);
        bool DropItem(Item item);
    }
}

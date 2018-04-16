using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos.Interfaces
{
    //gebruik maken van een interface voor repository zodat dependency injection gebruikt kan worden.
    public interface ICharacterRepository
    {
        List<Character> FindMyCharacters(string username);
        Character FindCharacterByName(String naam);
        bool UseItem(Item item);
        bool EquipItem(Item item, int characterID);
        bool DropItem(Item item);
    }
}

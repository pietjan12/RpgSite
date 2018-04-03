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
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Api.Interfaces
{
    public interface ICharacter
    {
        Character FindMyCharacters(int user_ID);
        Character FindCharacterByName(String naam);
    }
}

using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ICharacterService
    {
        Character FindMyCharacters(int userid);
        Character FindCharacterByName(String name);
    }
}

﻿using Api.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ICharacterService
    {
        List<Character> FindMyCharacters(string username);
        Character FindCharacterByName(String name);
        bool UseItem(Item item);
        bool EquipItem(Item item);
        bool DropItem(Item item);
    }
}

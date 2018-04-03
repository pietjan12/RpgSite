using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace rpgsite3.Models
{
    public class CharacterModel
    {
        public Character character { get; set; }
        public List<Character> foundCharacters { get; set; }
    }
}

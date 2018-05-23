using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;

namespace rpgsite3.Models
{
    public class GameIndexModel
    {
        public int NormalPlayerCount { get; set; }
        public int AdminPlayerCount { get; set; }
        public IEnumerable<Monster> enemies { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data.Models;

namespace rpgsite3.Models
{
    public class GameIndexModel
    {
        public IEnumerable<Monster> enemies { get; set; }
    }
}

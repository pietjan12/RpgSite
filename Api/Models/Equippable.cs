using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Models
{
    public class Equippable : Item
    {
        public int level { get; set; }
        public int strength { get; set; }
        public int intelligence { get; set; }
        public bool equipped { get; set; }
    }
}

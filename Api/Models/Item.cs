using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Models
{
    public class Item
    {
        public string name { get; set; }
        public string description { get; set; }
        public Rarity Rarity { get; set; }
        public string img_loc { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Api.Models
{
    public class Item
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public Rarity Rarity { get; set; }
        public int category { get; set; }
        public List<string> actions { get; set; }
        public string img_loc { get; set; }
        //Een item heeft altijd een level
        public bool equipped { get; set; }
        public int level { get; set; }
        //Maar heeft (meestal) slechts alleen defense of damage. Nullable geimplementeerd.
        public int? damage { get; set; }
        public int? defense { get; set; }
    }
}

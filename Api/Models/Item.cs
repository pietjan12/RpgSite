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
        //Descriptors
        public string name { get; set; }
        public string description { get; set; }
        public string img_loc { get; set; }
        //Categories
        public Rarity Rarity { get; set; }
        public int category { get; set; }
        //Actions
        public List<string> actions { get; set; }
        //Parameters
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Api.Models
{
    public class Character
    {
        [Key]
        public int id { get; set; }
        public string naam { get; set; }
        public int strength { get; set; }
        public int intelligence { get; set; }
        public int level { get; set; }
        public List<Item> inventory { get; set; }
        public List<Skill> skills { get; set; }
    }
}

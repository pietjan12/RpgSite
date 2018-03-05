using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Api.Models
{
    public class Monster
    {
        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string story { get; set; }
        public string image_url { get; set; }
       

    }
}

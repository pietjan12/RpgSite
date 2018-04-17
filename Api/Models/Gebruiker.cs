using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class Gebruiker
    {

        [Key]
        public int user_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public bool admin { get; set; }
    }
}

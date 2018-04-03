using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace rpgsite3.Models.ValidationModels
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Required")]
        public string username { get; set; }

        [Required(ErrorMessage = "Required")]
        public string password { get; set; }
    }
}

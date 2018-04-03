using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace rpgsite3.Models.ValidationModels
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Required")]
        [Remote("CheckExistingUser", "Account")]
        public string username { get; set; }

        [RegularExpression(@"^.*(?=.*\d)(?=.*[a-zA-Z]).*$", ErrorMessage = "Password must contain atleast one letter and one number")]
        [Required(ErrorMessage = "Required")]
        [StringLength(128, MinimumLength = 8, ErrorMessage = "Password needs to be atleast 8 characters")]
        public string password { get; set; }
    }
}

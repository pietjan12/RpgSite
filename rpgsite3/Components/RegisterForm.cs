using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models.ValidationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace rpgsite3.Components
{
    public class RegisterForm : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            RegisterModel model = new RegisterModel();
            return View(model);
        }
    }
}

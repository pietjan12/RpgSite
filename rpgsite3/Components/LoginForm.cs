using Microsoft.AspNetCore.Mvc;
using rpgsite3.Models.ValidationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace rpgsite3.Components
{
    public class LoginForm : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            LoginModel model = new LoginModel();
            return View(model);
        }
    }
}

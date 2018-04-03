using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace rpgsite3.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAccountService _AccountService;

        public AccountController(IAccountService AccountService)
        {
            _AccountService = AccountService;
        }

        //AccountService
        [HttpPost]
        public IActionResult Register(String username, String password)
        {
            bool Registered = _AccountService.TryRegister(username, password);

            return Json(Registered);
        }

        [HttpPost]
        public IActionResult Login(String username, String password)
        {
            bool loggedIn = _AccountService.TryLogin(username, password);

            return Json(loggedIn);
        }

        [Authorize]
        [HttpPost]
        public void LogOut()
        {
            //Uitloggen
            _AccountService.TryLogout();
        }

        public JsonResult CheckExistingUser(string username)
        {
            bool taken = _AccountService.CheckUser(username);
            if(taken)
            {
                return Json(string.Format("{0} is not available", username));
            }

            return Json(true);
        }
    }
}
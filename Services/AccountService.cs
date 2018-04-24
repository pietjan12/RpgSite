using Data.Repos.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountService(IAccountRepository context, IHttpContextAccessor HttpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = HttpContextAccessor;
        }

        public bool TryLogin(string username, string password)
        {
            if (!String.IsNullOrEmpty(username) && !String.IsNullOrEmpty(password))
            {
                bool isLoggedIn = _context.Login(username, password);
                if (isLoggedIn)
                {
                    //Gebruiker opslaan in cookie.
                    SignIn(username, IsAdmin(username));
                }
                return isLoggedIn;
            }
            return false;
        }

        public bool TryRegister(string username, string password)
        {
            //Controleren of input niet leeg is.
            if(!String.IsNullOrEmpty(username) && !String.IsNullOrEmpty(password))
            {
                //Proberen te registreren.
                return _context.Register(username, password);
            }
            //Standaard false returnen.
            return false;
        }

        public async void TryLogout()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        private async void SignIn(string username, bool isAdmin)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("Username", username));
            claims.Add(new Claim("Admin", isAdmin.ToString()));
            //Gegevens opslaan in een identity.
            ClaimsIdentity identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            AuthenticationProperties options = new AuthenticationProperties
            {
                //Ticket verloopt na 2 uur
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(240),
                IsPersistent = true
            };
            //Inloggen met cookie
            await _httpContextAccessor.HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            options);
        }

        private bool IsAdmin(string username)
        {
            if (!string.IsNullOrEmpty(username))
            {
                return _context.IsAdmin(username);
            }
            return false;
        }

        public bool CheckUser(string username)
        {
            if(!string.IsNullOrEmpty(username))
            {
                return _context.IsTaken(username);
            }
            //Standaard blokkeren.
            return true;
        }

        public List<int> GetPlayerCountByRole()
        {
            return _context.GetPlayerCountByRole();
        }
    }
}

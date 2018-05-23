using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Contexts
{
    public class AccountMemoryContext : IAccountContext
    {
        private List<Gebruiker> users { get; set; }

        public AccountMemoryContext() {
            users = new List<Gebruiker>();

            //test data initialiseren
            Gebruiker g = new Gebruiker();
            g.user_id = 1;
            g.username = "TestBoi69";
            g.password = "SecurePassword";
            g.admin = true;

            Gebruiker g2 = new Gebruiker();
            g2.user_id = 2;
            g2.username = "pieterke";
            g2.password = "password";
            g2.admin = false;

            users.Add(g);
            users.Add(g2);
        }

        public bool Login(string username, string password)
        {
            //kijken of de gebruiker in de list zit.
            return users.Exists(i => i.username == username && i.password == password);
        }

        public bool Register(string username, string password)
        {
            //Hoogste user id opvragen van list, anders 1 returnen.
            var highestUserId = users.Any() ? users.Select(i => i.user_id).Max() : 1;
            Gebruiker g = new Gebruiker();
            g.user_id = highestUserId + 1;
            g.username = username;
            g.password = password;
            //admins kunnen niet vanuit register aangemaakt worden.
            g.admin = false;

            users.Add(g);

            //teruggeven of de gebruiker in de lijst is toegevoegd.
            return users.Exists(i => i.user_id == g.user_id);
        }

        public bool IsAdmin(string username)
        {
            Gebruiker user = users.FirstOrDefault(i => i.username == username);
            if(user != null)
            {
                return user.admin;
            }
            //standaard false teruggeven
            return false;
        }

        public bool IsTaken(string username)
        {
            return users.Exists(i => i.username == username);
        }

        public List<int> GetPlayerCountByRole()
        {
            int NormalPlayerCount = users.FindAll(u => u.admin == false).Count;
            int AdminCount = users.FindAll(u => u.admin == true).Count;

            List<int> PlayerCounts = new List<int>();
            PlayerCounts.Add(NormalPlayerCount);
            PlayerCounts.Add(AdminCount);
            return PlayerCounts;

        }
    }
}

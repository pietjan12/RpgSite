using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Contexts
{
    public interface IAccountContext
    {
        bool Login(string username, string password);
        bool Register(string username, string password);
        bool IsAdmin(string username);
        bool IsTaken(string username);
        List<int> GetPlayerCountByRole();
    }
}

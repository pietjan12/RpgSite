using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Interfaces
{
    public interface IAccount
    {
        bool Login(string username, string password);
        bool Register(string username, string password);

        bool IsAdmin(string username);
        bool IsTaken(string username);
    }
}

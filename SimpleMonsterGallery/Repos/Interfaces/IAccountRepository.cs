using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos.Interfaces
{
    //gebruik maken van een interface voor repository zodat dependency injection gebruikt kan worden.
    public interface IAccountRepository
    {
        bool Login(string username, string password);
        bool Register(string username, string password);
        List<int> GetPlayerCountByRole();
        bool IsAdmin(string username);
        bool IsTaken(string username);
        void ChangeType(StorageType type);
    }
}

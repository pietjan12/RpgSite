﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IAccountService
    {
        bool TryLogin(string username, string password);
        bool TryRegister(string username, string password);
        void TryLogout();
        bool CheckUser(string username);
    }
}

﻿using Data.Contexts;
using Data.Factory.Interface;
using Data.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repos
{
    public class AccountRepository : IAccountRepository
    {
        private IAccountFactory _contextFactory;
        private IAccountContext _context;

        public AccountRepository(IAccountFactory contextFactory)
        {
            _contextFactory = contextFactory;
            //standaard sql initialiseren
            _context = _contextFactory.ChangeType(StorageType.Sql);
        }

        public bool IsAdmin(string username)
        {
            return _context.IsAdmin(username);
        }

        public bool IsTaken(string username)
        {
            return _context.IsTaken(username);
        }

        public bool Login(string username, string password)
        {
            return _context.Login(username, password);
        }

        public bool Register(string username, string password)
        {
            return _context.Register(username, password);
        }
    }
}

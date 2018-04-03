using Api.Interfaces;
using Data.Base;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using BCrypt;

namespace Data
{
    public class AccountRepository : BaseRepo, IAccount
    {
        public AccountRepository(IConfiguration config) : base(config)
        {

        }

        public bool IsAdmin(string username)
        {
            using (IDbConnection db = OpenConnection())
            {
                int count = db.ExecuteScalar<int>("AdminCheck", new { username }, commandType: CommandType.StoredProcedure);

                bool IsAdmin = Convert.ToBoolean(count);

                return IsAdmin;
            }
        }

        public bool IsTaken(string username)
        {
            using (IDbConnection db = OpenConnection())
            {
                int count = db.ExecuteScalar<int>("UserExists", new { gebruiker = username }, commandType: CommandType.StoredProcedure);

                if(count > 0)
                {
                    //Gebruiker bestaat al in systeem.
                    return true;
                }

                return false;
            }
        }

        public bool Login(string username, string password)
        {
            using (IDbConnection db = OpenConnection())
            {
                try
                {
                    //HashedPassword opvragen.
                    string HashedPassword = db.ExecuteScalar<string>("LoginTest", new { gebruiker = username }, commandType: CommandType.StoredProcedure);
                    //Hash vergelijken met ingevoerde waarde.
                    bool isGood = BCryptHelper.CheckPassword(password, HashedPassword);

                    return isGood;
                } catch(ArgumentException e)
                {
                    //Kan gebeuren als er een foute salt is opgegeven.
                    return false;
                }
            }
        }

        public bool Register(string username, string password)
        {
            using (IDbConnection db = OpenConnection())
            {
                //Controleren of gebruikersnaam al bezet is.
                int RowCount = db.ExecuteScalar<int>("UserExists", new { gebruiker = username }, commandType: CommandType.StoredProcedure);
                
                if (RowCount > 0)
                {
                    //Gebruikersnaam is al bezet, false returnen
                    return false;
                }
                else
                {
                    //Salt genereren.
                    string salt = BCryptHelper.GenerateSalt(12);
                    //password encrypten.
                    string EncryptedPassword = BCryptHelper.HashPassword(password, salt);

                    //Voeg gebruiker toe
                    string Squery = "Register";
                    var ChangedRows = db.Execute(Squery,
                        new { gebruiker = username, password = EncryptedPassword },
                        commandType: CommandType.StoredProcedure
                        );
                    
                    if (ChangedRows == 1)
                    {
                        return true;
                    }
                }
                return false;
            }
        }
    }
}

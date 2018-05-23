using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using Data.Contexts;
using Api.Models;

namespace Data
{
    public class EnemiesSqlContext : IEnemiesContext
    {
        private string ConnectionString;

        public EnemiesSqlContext(IConfiguration config)
        {
            this.ConnectionString = config["Data:TestConnection"];
        }

        public IEnumerable<Monster> GenerateMonsters(int numberOfMonsters)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetRandomMonsters";
                return db.Query<Monster>(sQuery, new { amount = numberOfMonsters } ,commandType: CommandType.StoredProcedure).AsList();
            }
        }

        public IEnumerable<Monster> getAll()
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetMonsters";
                return db.Query<Monster>(sQuery, commandType: CommandType.StoredProcedure).AsList();
            }
            
        }

        public IEnumerable<Monster> getByName(string name)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "SELECT * FROM ENEMIES WHERE NAME = @naam";
                return db.Query<Monster>(sQuery, new { naam = name });
            }
        }

        private SqlConnection OpenConnection()
        {
            return new SqlConnection(ConnectionString);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Data
{
    public class MonsterGalleryRepository : IEnemies
    {
        private string connectionString;

        public MonsterGalleryRepository()
        {
            //Nog omzetten naar app.json centrale connection string.
            connectionString = @"Server=localhost;Uid=root;Database=rpgsite;Pwd=;";
        }

        private MySqlConnection OpenConnection()
        {
            return new MySqlConnection(connectionString);
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
    }
}

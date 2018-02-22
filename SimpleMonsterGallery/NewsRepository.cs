using Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Data
{
    public class NewsRepository : INews
    {
        private string connectionString;

        public NewsRepository()
        {
            //Nog omzetten naar app.json centrale connection string.
            connectionString = @"Server=localhost;Uid=root;Database=rpgsite;Pwd=;";
        }

        private MySqlConnection OpenConnection()
        {
            return new MySqlConnection(connectionString);
        }

        public IEnumerable<News> GetAll()
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetAllNews";
                return db.Query<News>(sQuery, commandType: CommandType.StoredProcedure).AsList();
            }
        }

        public IEnumerable<News> GetByID(int id)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "FindNews";
                return db.Query<News>(sQuery, new { newsid = id }, commandType: CommandType.StoredProcedure).AsList();
            }
        }
    }
}

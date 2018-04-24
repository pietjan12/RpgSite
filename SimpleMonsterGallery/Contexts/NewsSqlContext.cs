using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using MySql.Data.MySqlClient;
using Data.Contexts;
using Api.Models;
using Microsoft.Extensions.Configuration;
using Dapper;
using Microsoft.AspNetCore.Http;
using System.Data.SqlClient;

namespace Data
{
    public class NewsSqlContext : INewsContext
    {
        private string ConnectionString;

        public NewsSqlContext(IConfiguration config)
        {
            this.ConnectionString = config["Data:TestConnection"];
        }

        public bool CreateArticle(string Title, string text, string img_loc, string username)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "CreateArticle";
                var changedrows = db.Execute(sQuery, new { nieuwstitel = Title, nieuwstext = text, imglocatie = img_loc, username }, commandType: CommandType.StoredProcedure);

                if(changedrows > 0)
                {
                    return true;
                }
                return false;
            }
        }

        public bool EditArticle(int id, string title, string text, string img_loc)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "EditArticle";

                var changedrows = db.Execute(sQuery, new { id, nieuwstitel = title, nieuwstext = text, imglocatie = img_loc }, commandType: CommandType.StoredProcedure);

                if (changedrows > 0)
                {
                    return true;
                }
                return false;
            }
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

        private SqlConnection OpenConnection()
        {
            return new SqlConnection(ConnectionString);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using MySql.Data.MySqlClient;
using Data.Base;
using Api.Interfaces;
using Api.Models;
using Microsoft.Extensions.Configuration;
using Dapper;

namespace Data
{
    public class NewsRepository : BaseRepo, INews
    {
        public NewsRepository(IConfiguration config) : base(config)
        {
        }

        public IEnumerable<News> GetAll()
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "GetAllNews";

                var list = db.Query<News, Gebruiker, News>(sQuery, (news, gebruiker) => { news.user = gebruiker; return news; },splitOn: "user_id", commandType: CommandType.StoredProcedure).AsList();

                return list;
               
            }
        }

        public IEnumerable<News> GetByID(int id)
        {
            using (IDbConnection db = OpenConnection())
            {
                string sQuery = "FindNews";
                return db.Query<News, Gebruiker, News>(sQuery, (news, gebruiker) => { news.user = gebruiker; return news; }, new { newsid = id }, splitOn: "user_id", commandType: CommandType.StoredProcedure).AsList();
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using Dapper;
using MySql.Data.MySqlClient;
using Data.Base;
using Api.Interfaces;
using Api.Models;
using Microsoft.Extensions.Configuration;

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

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MySql.Data.MySqlClient;
using Data.Base;
using Microsoft.Extensions.Configuration;
using Api.Interfaces;
using Api.Models;

namespace Data
{
    public class MonsterGalleryRepository : BaseRepo, IEnemies
    {
        public MonsterGalleryRepository(IConfiguration config) : base(config)
        {
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

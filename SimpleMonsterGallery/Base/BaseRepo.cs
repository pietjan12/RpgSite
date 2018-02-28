using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace Data.Base
{
    public abstract class BaseRepo
    {
        private readonly IConfiguration config;
        private readonly String connectionString;

        public BaseRepo(IConfiguration config)
        {
            //Config en connectiestring
            this.config = config;
            //this.connectionString = config["Data:DefaultConnection"];
            this.connectionString = config["Data:TestConnection"];
        }

        public SqlConnection OpenConnection()
        {
            return new SqlConnection(connectionString);
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;

namespace rpgsite3.Models
{
    public class NewsModel
    {
        public List<News> News { get; set; }

        public NewsModel()
        {
            News = new List<News>();
        }
    }
}

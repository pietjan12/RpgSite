using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Models
{
    public class News { 
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string Author { get; set; }
        public DateTime PostDate { get; set; }
        public string Img_Loc { get; set; }
        
    }
}

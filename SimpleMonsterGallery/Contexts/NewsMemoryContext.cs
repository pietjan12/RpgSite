using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;

namespace Data.Contexts
{
    public class NewsMemoryContext : INewsContext
    {
        private List<News> test { get; set; }
        public NewsMemoryContext()
        {
            test = new List<News>();
            //Testnieuws aanmaken
            News n = new News();
            n.Id = 0;
            n.author = "Admin";
            n.Img_Loc = "";
            n.PostDate = DateTime.Today;
            n.Text = "TEST NIEUWS";
            n.Title = "TEST";

            test.Add(n);
        }

        public bool CreateArticle(string Title, string text, string img_loc, string username)
        {
            News n = new News();
            n.Title = Title;
            n.Text = text;
            n.Img_Loc = img_loc;
            n.author = username;
            test.Add(n);
            return true;
        }

        public bool EditArticle(int id, string Title, string text, string img_loc)
        {
            News articleToEdit = test.Find(i => i.Id == id);
            articleToEdit.Title = Title;
            articleToEdit.Text = text;
            articleToEdit.Img_Loc = img_loc;

            return true;
        }

        public IEnumerable<News> GetAll()
        {
            return test;
        }

        public IEnumerable<News> GetByID(int id)
        {
            return test.FindAll(i => i.Id == id);
        }
    }
}

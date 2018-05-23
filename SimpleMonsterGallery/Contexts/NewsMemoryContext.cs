using System;
using System.Collections.Generic;
using System.Text;
using Api.Models;
using System.Linq;

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
            n.Id = test.Count;
            n.Title = Title;
            n.Text = text;
            n.Img_Loc = img_loc;
            n.author = username;
            test.Add(n);
            return true;
        }

        public bool EditArticle(int id, string Title, string text, string img_loc)
        {
            News articleToEdit = test.FirstOrDefault(i => i.Id == id);
            if (articleToEdit != null)
            {
                articleToEdit.Title = Title;
                articleToEdit.Text = text;
                articleToEdit.Img_Loc = img_loc;

                return true;
            }
            //Artikel was niet gevonden, false returnen.
            return false;
        }

        public IEnumerable<News> GetAll()
        {
            return test;
        }

        public News GetByID(int id)
        {
            return test.FirstOrDefault(i => i.Id == id);
        }
    }
}

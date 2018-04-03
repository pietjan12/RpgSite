﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Data;
using Services;
using Services.Interfaces;
using Api.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace rpgsite3
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Service voor het opvragen van connectiestring
            services.AddSingleton(_ => Configuration);

            //News services
            services.AddScoped<INewsService, NewsService>();
            services.AddTransient<INews, NewsRepository>();
            //Enemy list services
            services.AddScoped<iEnemyService, EnemyService>();
            services.AddTransient<IEnemies, MonsterGalleryRepository>();
            //Character services
            services.AddScoped<ICharacterService, CharacterService>();
            services.AddTransient<ICharacter, CharacterRepository>();
            //Account services
            services.AddScoped<IAccountService, AccountService>();
            services.AddTransient<IAccount, AccountRepository>();

            //Authentication toevoegen
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o => o.LoginPath = "/");
           
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            //We maken gebruiken van cookie authentication.
            app.UseAuthentication();
            //WWWROOT files op kunnen vragen
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {

                routes.MapRoute(
                name: "realnews",
                template: "News/",
                defaults: new { controller = "News", action = "Index" });

                routes.MapRoute(
               name: "editArticle",
               template: "News/EditArticle",
               defaults: new { controller = "News", action = "EditArticle" });

                routes.MapRoute(
                name: "createarticle",
                template: "News/CreateArticle",
                defaults: new { controller = "News", action = "CreateArticle" });

                routes.MapRoute(
               name: "addArticle",
               template: "News/AddArticle",
               defaults: new { controller = "News", action = "AddArticle" });

                routes.MapRoute(
                name: "dashboard",
                template: "News/Dashboard",
                defaults: new { controller = "News", action = "Dashboard" });

                routes.MapRoute(
                name: "news",
                template: "News/{*id}",
                defaults: new { controller = "News", action = "News" });

                routes.MapRoute(
                  name: "ActualGame",
                  template: "Game/Game",
                  defaults: new { controller = "Game", action = "Game" });

                routes.MapRoute(
                name: "game",
                template: "game/",
                defaults: new { controller = "Game", action = "Index" });

               


                routes.MapRoute(
                name: "default",
                template: "{controller=Home}/{action=Index}");

            });
        }
    }
}

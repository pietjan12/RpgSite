using System;
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

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {

                routes.MapRoute(
                name: "realnews",
                template: "News/",
                defaults: new { controller = "News", action = "Index" });

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

using Data.Contexts;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Factory
{
    //Laten zien aan wilrik, was goed.
    public class NewsFactory : INewsFactory
    {
        private readonly IServiceProvider _provider;

        public NewsFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public INewsContext ChangeType(StorageType type)
        {
            var services = _provider.GetServices<INewsContext>();
            if(type == StorageType.Sql) {
                //Cleanest code in my life
                INewsContext context = services.First(o => o.GetType() == typeof(NewsSqlContext));
                if(context != null) {
                    return context;
                } else {
                    throw new NullReferenceException("Geen service gevonden");
                }
            }
            else if( type == StorageType.Memory) {
                INewsContext context = services.First(o => o.GetType() == typeof(NewsMemoryContext));
                if (context != null) {
                    return context;
                }
                else {
                    throw new NullReferenceException("Geen service gevonden");
                }
            } else {
                throw new ArgumentException("Incorrect storagetype given, expected sql or memory");
            }
        }
    }
}

using Data.Contexts;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Factory
{
    public class EnemiesFactory : IEnemiesFactory
    {
        private readonly IServiceProvider _provider;

        public EnemiesFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public IEnemiesContext ChangeType(StorageType type)
        {
            var services = _provider.GetServices<IEnemiesContext>();
            if (type == StorageType.Sql)
            {
                //Cleanest code in my life
                IEnemiesContext context = services.FirstOrDefault(o => o.GetType() == typeof(EnemiesSqlContext));
                if (context != null)
                {
                    return context;
                }
                else
                {
                    throw new NullReferenceException("Geen service gevonden");
                }
            }
            else if (type == StorageType.Memory)
            {
                IEnemiesContext context = services.FirstOrDefault(o => o.GetType() == typeof(EnemiesMemoryContext));
                if (context != null)
                {
                    return context;
                }
                else
                {
                    throw new NullReferenceException("Geen service gevonden");
                }
            }
            else
            {
                throw new ArgumentException("Incorrect storagetype given, expected sql or memory");
            }
        }
    }
}

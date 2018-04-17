using Data.Contexts;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Factory
{
    public class CharacterFactory : ICharacterFactory
    {
        private readonly IServiceProvider _provider;

        public CharacterFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public ICharacterContext ChangeType(StorageType type)
        {
            var services = _provider.GetServices<ICharacterContext>();
            if (type == StorageType.Sql)
            {
                //Cleanest code in my life
                ICharacterContext context = services.First(o => o.GetType() == typeof(CharacterSqlContext));
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
                ICharacterContext context = services.First(o => o.GetType() == typeof(CharacterMemoryContext));
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

using Data.Contexts;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Factory
{
    public class AccountFactory : IAccountFactory
    {
        private readonly IServiceProvider _provider;

        public AccountFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public IAccountContext ChangeType(StorageType type)
        {
            var services = _provider.GetServices<IAccountContext>();
            if (type == StorageType.Sql)
            {
                //Cleanest code in my life
                IAccountContext context = services.FirstOrDefault(o => o.GetType() == typeof(AccountSqlContext));
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
                IAccountContext context = services.FirstOrDefault(o => o.GetType() == typeof(AccountMemoryContext));
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

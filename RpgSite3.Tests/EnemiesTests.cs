using Api.Models;
using Data.Contexts;
using Data.Factory;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RpgSite3.Tests
{
    [TestClass]
    public class EnemiesTests
    {
        private IEnemiesFactory _EnemiesFactory;
        private IEnemiesContext _EnemiesContext;

        public EnemiesTests()
        {
            //Services opbouwen voor unit testen, alleen interface implementatie initialiseren die gebruikt wordt.
            var services = new ServiceCollection();
            //Transient zodat deze per methode refresht.
            services.AddTransient<IEnemiesContext, EnemiesMemoryContext>();
            var serviceProvider = services.BuildServiceProvider();

            //Enemiesfactory creeren met toegevoegde serviceprovider, zodat deze onderscheid kan maken tussen evt. services in de lijst.
            _EnemiesFactory = new EnemiesFactory(serviceProvider);
            _EnemiesContext = _EnemiesFactory.ChangeType(StorageType.Memory);
        }


        [TestMethod]
        public void TestGetMonsterByNameValidName()
        {
            IEnumerable<Monster> enemy = _EnemiesContext.getByName("Goblin");
            Assert.AreEqual(1, enemy.Count());
        }

        [TestMethod]
        public void TestGetMonsterByNameInvalidName()
        {
            IEnumerable<Monster> enemy = _EnemiesContext.getByName("NonExisting");
            Assert.AreEqual(0, enemy.Count());
        }

        [TestMethod]
        public void TestGetRandomMonstersWithinRangeOfMonsters()
        {
            IEnumerable<Monster> monsters = _EnemiesContext.GenerateMonsters(3);
            Assert.AreEqual(3, monsters.Count());
        }

        [TestMethod]
        public void TestGetRandomMonstersOutsideOfRangeOfMonsters()
        {
            //zou gewoon moeten werken omdat intern in de methode de count van de list bijgehouden wordt als max.
            IEnumerable<Monster> monsters = _EnemiesContext.GenerateMonsters(5);
            Assert.AreEqual(5, monsters.Count());
        }

        [TestMethod]
        public void TestGetAllMonsters()
        {
            IEnumerable<Monster> monsters = _EnemiesContext.getAll();
            Assert.AreEqual(4, monsters.Count());
        }
    }
}

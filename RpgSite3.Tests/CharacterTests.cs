using Api.Models;
using Data.Contexts;
using Data.Factory;
using Data.Factory.Interface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace RpgSite3.Tests
{
    [TestClass]
    public class CharacterTests
    {
        private ICharacterFactory _CharacterFactory;
        private ICharacterContext _CharacterContext;

        public CharacterTests()
        {
            var services = new ServiceCollection();
            //Transient zodat deze per methode refresht.
            services.AddTransient<ICharacterContext, CharacterMemoryContext>();
            var serviceProvider = services.BuildServiceProvider();

            _CharacterFactory = new CharacterFactory(serviceProvider);

            _CharacterContext = _CharacterFactory.ChangeType(StorageType.Memory);
        }

        [TestMethod]
        public void TestGetCharactersExistingUserWithCharacters()
        {
            List<Character> characters = _CharacterContext.FindMyCharacters("TestBoi69");
            Assert.AreEqual(2, characters.Count);
        }

        [TestMethod]
        public void TestGetCharactersExistingUserNoCharacters()
        {
            List<Character> characters = _CharacterContext.FindMyCharacters("TestBoi70");
            Assert.AreEqual(0, characters.Count);
        }

        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        public void TestGetCharacterNonExistingUser()
        {
            List<Character> characters = _CharacterContext.FindMyCharacters("TestBoi71");
            Assert.AreEqual(0, characters.Count);
        }

        [TestMethod]
        public void TestGetCharacterByNameExisting()
        {
            Character c = _CharacterContext.FindCharacterByName("pieterke1");
            Assert.AreEqual("pieterke1", c.naam);
        }

        [TestMethod]
        public void TestGetCharacterByNameNonExisting()
        {
            Character c = _CharacterContext.FindCharacterByName("bobje");
            Assert.IsNull(c);
        }

        [TestMethod]
        public void TestEquipItemExistingLinkedToCharacter()
        {
            //Alleen id en naam is relevant voor opsporen item.
            Item i = new Item();
            i.id = 1;
            i.name = "Wooden Sword";

            int characterid = 1;

            bool EquippedItem = _CharacterContext.EquipItem(i, characterid);
            Assert.AreEqual(true, EquippedItem);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void TestEquipItemExistingNotLinkedToCharacter()
        {
            //item uit character zn inventory proberen te equippen op andere character zijn inventory. Hoort een exceptie op te treden.
            Item i = new Item();
            i.id = 3;
            i.name = "Steel Sword";
            int characterid = 1;

            bool EquippedItem = _CharacterContext.EquipItem(i, characterid);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void TestEquipItemNonExisting()
        {
            Item i = new Item();
            i.id = 6;
            i.name = "Dragon Sword";
            int characterid = 1;

            bool EquippedItem = _CharacterContext.EquipItem(i, characterid);
        }
    }
}

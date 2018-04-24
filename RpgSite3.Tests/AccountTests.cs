using Api.Models;
using RpgSite3;
using Moq;
using Data.Contexts;
using Data.Factory.Interface;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Data.Factory;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Data;
using System.Collections.Generic;

namespace RpgSite3.Tests
{
    [TestClass]
    public class AccountTests
    {
        private IAccountFactory _AccountFactory;
        private IAccountContext _AccountContext;

        public AccountTests()
        {
            var services = new ServiceCollection();
            //Transient zodat deze per methode refresht.
            services.AddTransient<IAccountContext, AccountMemoryContext>();
            var serviceProvider = services.BuildServiceProvider();

            _AccountFactory = new AccountFactory(serviceProvider);
            //Unit testing maakt gebruik van in memory database
            _AccountContext = _AccountFactory.ChangeType(StorageType.Memory);
        }

        //Eerste methode duurt langer omdat constructor initialization meetelt
        [TestMethod]
        public void TestAddOneUser()
        {
            var username = "Testboi70";
            var password = "securepass";
            bool HasBeenAdded = _AccountContext.Register(username, password);
            //Controleren of gebruiker ook is toegevoegd
            Assert.AreEqual(true, HasBeenAdded);
        }

        [TestMethod]
        public void TestAddMultipleUsers()
        {
            var username = "Testboi71";
            var password = "securepass";
            var username2 = "Testboi72";
            var password2 = "securepass";

            _AccountContext.Register(username, password);
            _AccountContext.Register(username2, password2);

            //Dont question it ok.
            List<int> TotalPlayersByRole = _AccountContext.GetPlayerCountByRole();
            //Totaal aantal spelers optellen
            var count = TotalPlayersByRole[0] + TotalPlayersByRole[1];

            Assert.AreEqual(4, count);
        }

        [TestMethod]
        public void TestUserIsTakenExistsInMemory() {
            bool IsTaken = _AccountContext.IsTaken("TestBoi69");
            Assert.AreEqual(true, IsTaken);
        }

        [TestMethod]
        public void TestUserIsTakenDoesNotExistInMemory()
        {
            bool isTaken = _AccountContext.IsTaken("HoiBoi69");
            Assert.AreEqual(false, isTaken);
        }

        [TestMethod]
        public void TestUserIsAdminTrue()
        {
            bool IsAdmin = _AccountContext.IsAdmin("TestBoi69");
            Assert.AreEqual(true, IsAdmin);
        }

        [TestMethod]
        public void TestUserIsAdminFalse() {
            bool IsAdmin = _AccountContext.IsAdmin("pieterke");
            Assert.AreEqual(false, IsAdmin);
        }

        [TestMethod]
        public void TestGetCountNormalAccounts()
        {
            List<int> PlayerCountsByRole = _AccountContext.GetPlayerCountByRole();
            Assert.AreEqual(1, PlayerCountsByRole[0]);
        }

        [TestMethod]
        public void TestGetCountAdminAccounts()
        {
            List<int> PlayerCountsByRole = _AccountContext.GetPlayerCountByRole();
            Assert.AreEqual(1, PlayerCountsByRole[1]);
        }

        [TestMethod]
        public void TestLoginExistingUser()
        {
            bool LoggedIn = _AccountContext.Login("TestBoi69", "SecurePassword");
            Assert.AreEqual(true, LoggedIn);
        }

        [TestMethod]
        public void TestLoginNonExistingUser()
        {
            bool LoggedIn = _AccountContext.Login("NonExistingBoi69", "SecurePassword");
        }
    }
}

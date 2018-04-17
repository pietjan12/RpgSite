﻿using Data.Contexts;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Factory.Interface
{
    public interface IEnemiesFactory
    {
        IEnemiesContext ChangeType(StorageType type);
    }
}

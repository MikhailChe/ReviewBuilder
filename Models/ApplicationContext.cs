using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;

namespace ReviewBuilder.Models
{
    public class ApplicationContext //: DbContext
    {
        public static ConcurrentDictionary<string, UserData> UsersData =
    new ConcurrentDictionary<string, UserData>();
        public static MemoryStream templateFile = new MemoryStream();

        public static Dictionary<string, string> checkCellList = new Dictionary<string, string>();


    }
}
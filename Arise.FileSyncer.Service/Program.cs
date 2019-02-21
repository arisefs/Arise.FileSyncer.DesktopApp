using System;
using System.Threading;

namespace Arise.FileSyncer.Service
{
    class Program
    {
        static void Main(string[] args)
        {
            var syncerService = new SyncerService();
            syncerService.Run();
            Thread.Sleep(Timeout.Infinite);
        }
    }
}

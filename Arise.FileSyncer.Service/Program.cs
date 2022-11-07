using System;
using System.Linq;
using System.Threading;

namespace Arise.FileSyncer.Service
{
    class Program
    {
        static void Main(string[] args)
        {
            Log.SetLogger(new DesktopLogger(args.Contains("-v")));

            var syncerService = new SyncerService();

            try
            {
                syncerService.Run();
            }
            catch (Exception ex)
            {
                Log.Error($"Fatal error: {ex.Message}");
#if DEBUG
                throw;
#else
                return;
#endif
            }

            Thread.Sleep(Timeout.Infinite);
        }
    }
}

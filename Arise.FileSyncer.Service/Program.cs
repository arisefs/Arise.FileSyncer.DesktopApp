using System;
using System.Threading;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service
{
    class Program
    {
        static void Main(string[] args)
        {
            Log.Error = (msg)=> { Console.WriteLine($"E: {msg}"); };
            Log.Warning = (msg) => { Console.WriteLine($"W: {msg}"); };
            Log.Info = (msg) => { Console.WriteLine($"I: {msg}"); };
            Log.Verbose = (msg) => { Console.WriteLine($"V: {msg}"); };
            Log.Debug = (msg) => { Console.WriteLine($"D: {msg}"); };

            var syncerService = new SyncerService();

            try
            {
                syncerService.Run();
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return;
            }
            
            Thread.Sleep(Timeout.Infinite);
        }
    }
}

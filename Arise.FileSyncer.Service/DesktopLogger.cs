using System;

namespace Arise.FileSyncer.Service
{
    internal class DesktopLogger : Logger
    {
        private readonly bool verbose;

        public DesktopLogger(bool verbose)
        {
            this.verbose = verbose;
        }

        public override void Log(LogLevel level, string message)
        {
            switch (level)
            {
                case LogLevel.Error:
                case LogLevel.Warning:
                case LogLevel.Info:
                    PrintFormatted(level, message);
                    break;
                case LogLevel.Verbose:
                    if (verbose) PrintFormatted(level, message);
                    break;
                case LogLevel.Debug:
#if DEBUG
                    PrintFormatted(level, message);
#endif
                    break;
            }
        }

        private static void PrintFormatted(LogLevel level, string message)
        {
            var now = DateTime.Now;
            var letter = LevelToLetter(level);
            Console.WriteLine($"{now.Hour:00}:{now.Minute:00}:{now.Second:00} | {letter}: {message}");
        }
    }
}

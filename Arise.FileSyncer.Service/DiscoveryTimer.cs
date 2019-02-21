using System;
using System.Threading;
using Arise.FileSyncer.Common;

namespace Arise.FileSyncer.Service
{
    internal class DiscoveryTimer : IDisposable
    {
        private const int checkPeriod = 600000; // 10 minute
        private readonly NetworkDiscovery discovery;

        private Timer periodicCheckTimer;

        public DiscoveryTimer(NetworkDiscovery discovery)
        {
            this.discovery = discovery;
            periodicCheckTimer = new Timer((o) => discovery.SendDiscoveryMessage(), null, 0, checkPeriod);
        }

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if (periodicCheckTimer != null)
                    {
                        periodicCheckTimer.Dispose();
                        periodicCheckTimer = null;
                    }
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}

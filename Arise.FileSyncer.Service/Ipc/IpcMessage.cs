using System;
using System.Collections.Generic;
using System.Reflection;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc
{
    public abstract class IpcMessage
    {
        public abstract string Command { get; }

        internal virtual void Process(IpcController ipc)
        {
            IncorrectAction();
        }

        private void IncorrectAction()
        {
            Log.Warning("Incorrect IPC message action: " + Command);
#if DEBUG
            throw new NotImplementedException();
#endif
        }
    }

    internal static class IpcMessageFactory
    {
        private static readonly Dictionary<string, Type> messageTypes;

        static IpcMessageFactory()
        {
            messageTypes = new Dictionary<string, Type>();
            Assembly currentAssembly = Assembly.GetExecutingAssembly();

            foreach (Type classType in currentAssembly.GetTypes())
            {
                if (typeof(IpcMessage).IsAssignableFrom(classType) && !classType.IsAbstract)
                {
                    IpcMessage ipcMessage = CreateClass(classType);
                    messageTypes.Add(ipcMessage.Command, classType);
                }
            }
        }

        public static IpcMessage Create(string command)
        {
            return CreateClass(GetClassType(command));
        }

        private static Type GetClassType(string command)
        {
            if (messageTypes.TryGetValue(command, out Type classType)) return classType;
            else throw new Exception("NetMessage: No class found for command");
        }

        private static IpcMessage CreateClass(Type messageClassType)
        {
            return (IpcMessage)Activator.CreateInstance(messageClassType);
        }
    }
}

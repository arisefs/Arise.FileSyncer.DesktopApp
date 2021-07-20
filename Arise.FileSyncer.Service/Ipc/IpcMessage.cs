using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.Messages;

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

        public static Type GetClassType(string command)
        {
            if (messageTypes.TryGetValue(command, out Type classType)) return classType;
            else throw new Exception("NetMessage: No class found for command");
        }

        private static IpcMessage CreateClass(Type messageClassType)
        {
            return (IpcMessage)Activator.CreateInstance(messageClassType);
        }

        public static IpcMessage Deserialize(string command, string json)
        {
            return command switch
            {
                "connectionAdded" => JsonSerializer.Deserialize<ConnectionAddedMessage>(json),
                "connectionRemoved" => JsonSerializer.Deserialize<ConnectionRemovedMessage>(json),
                "connectionVerified" => JsonSerializer.Deserialize<ConnectionVerifiedMessage>(json),
                "deleteProfile" => JsonSerializer.Deserialize<DeleteProfileMessage>(json),
                "deleteProfileResult" => JsonSerializer.Deserialize<DeleteProfileResultMessage>(json),
                "editProfile" => JsonSerializer.Deserialize<EditProfileMessage>(json),
                "editProfileResult" => JsonSerializer.Deserialize<EditProfileMessageResult>(json),
                "initialization" => JsonSerializer.Deserialize<InitializationMessage>(json),
                "newProfile" => JsonSerializer.Deserialize<NewProfileMessage>(json),
                "newProfileResult" => JsonSerializer.Deserialize<NewProfileResultMessage>(json),
                "profileAdded" => JsonSerializer.Deserialize<ProfileAddedMessage>(json),
                "profileChanged" => JsonSerializer.Deserialize<ProfileChangedMessage>(json),
                "profileRemoved" => JsonSerializer.Deserialize<ProfileRemovedMessage>(json),
                "receivedProfile" => JsonSerializer.Deserialize<ReceivedProfileMessage>(json),
                "receivedProfileResult" => JsonSerializer.Deserialize<ReceivedProfileResultMessage>(json),
                "sendProfile" => JsonSerializer.Deserialize<SendProfileMessage>(json),
                "setAllowPairing" => JsonSerializer.Deserialize<SetAllowPairingMessage>(json),
                "update" => JsonSerializer.Deserialize<UpdateMessage>(json),
                "welcome" => JsonSerializer.Deserialize<WelcomeMessage>(json),
                _ => throw new Exception("Invalid message command"),
            };
        }
    }
}

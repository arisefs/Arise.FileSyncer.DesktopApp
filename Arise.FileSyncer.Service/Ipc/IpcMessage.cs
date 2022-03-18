using System;
using System.Text.Json;
using System.Text.Json.Serialization;
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
        public static IpcMessage Deserialize(string command, string json)
        {
            return command switch
            {
                "connectionAdded" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ConnectionAddedMessage),
                "connectionRemoved" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ConnectionRemovedMessage),
                "connectionVerified" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ConnectionVerifiedMessage),
                "deleteProfile" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.DeleteProfileMessage),
                "deleteProfileResult" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.DeleteProfileResultMessage),
                "editProfile" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.EditProfileMessage),
                "editProfileResult" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.EditProfileMessageResult),
                "initialization" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.InitializationMessage),
                "newProfile" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.NewProfileMessage),
                "newProfileResult" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.NewProfileResultMessage),
                "profileAdded" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ProfileAddedMessage),
                "profileChanged" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ProfileChangedMessage),
                "profileRemoved" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ProfileRemovedMessage),
                "receivedProfile" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ReceivedProfileMessage),
                "receivedProfileResult" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.ReceivedProfileResultMessage),
                "sendProfile" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.SendProfileMessage),
                "setAllowPairing" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.SetAllowPairingMessage),
                "update" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.UpdateMessage),
                "welcome" => JsonSerializer.Deserialize(json, IpcJsonContext.Default.WelcomeMessage),
                _ => throw new Exception("Invalid message command"),
            };
        }

        public static byte[] Serialize(IpcMessage message)
        {
            return message.Command switch
            {
                "connectionAdded" => JsonSerializer.SerializeToUtf8Bytes((ConnectionAddedMessage)message, IpcJsonContext.Default.ConnectionAddedMessage),
                "connectionRemoved" => JsonSerializer.SerializeToUtf8Bytes((ConnectionRemovedMessage)message, IpcJsonContext.Default.ConnectionRemovedMessage),
                "connectionVerified" => JsonSerializer.SerializeToUtf8Bytes((ConnectionVerifiedMessage)message, IpcJsonContext.Default.ConnectionVerifiedMessage),
                "deleteProfile" => JsonSerializer.SerializeToUtf8Bytes((DeleteProfileMessage)message, IpcJsonContext.Default.DeleteProfileMessage),
                "deleteProfileResult" => JsonSerializer.SerializeToUtf8Bytes((DeleteProfileResultMessage)message, IpcJsonContext.Default.DeleteProfileResultMessage),
                "editProfile" => JsonSerializer.SerializeToUtf8Bytes((EditProfileMessage)message, IpcJsonContext.Default.EditProfileMessage),
                "editProfileResult" => JsonSerializer.SerializeToUtf8Bytes((EditProfileMessageResult)message, IpcJsonContext.Default.EditProfileMessageResult),
                "initialization" => JsonSerializer.SerializeToUtf8Bytes((InitializationMessage)message, IpcJsonContext.Default.InitializationMessage),
                "newProfile" => JsonSerializer.SerializeToUtf8Bytes((NewProfileMessage)message, IpcJsonContext.Default.NewProfileMessage),
                "newProfileResult" => JsonSerializer.SerializeToUtf8Bytes((NewProfileResultMessage)message, IpcJsonContext.Default.NewProfileResultMessage),
                "profileAdded" => JsonSerializer.SerializeToUtf8Bytes((ProfileAddedMessage)message, IpcJsonContext.Default.ProfileAddedMessage),
                "profileChanged" => JsonSerializer.SerializeToUtf8Bytes((ProfileChangedMessage)message, IpcJsonContext.Default.ProfileChangedMessage),
                "profileRemoved" => JsonSerializer.SerializeToUtf8Bytes((ProfileRemovedMessage)message, IpcJsonContext.Default.ProfileRemovedMessage),
                "receivedProfile" => JsonSerializer.SerializeToUtf8Bytes((ReceivedProfileMessage)message, IpcJsonContext.Default.ReceivedProfileMessage),
                "receivedProfileResult" => JsonSerializer.SerializeToUtf8Bytes((ReceivedProfileResultMessage)message, IpcJsonContext.Default.ReceivedProfileResultMessage),
                "sendProfile" => JsonSerializer.SerializeToUtf8Bytes((SendProfileMessage)message, IpcJsonContext.Default.SendProfileMessage),
                "setAllowPairing" => JsonSerializer.SerializeToUtf8Bytes((SetAllowPairingMessage)message, IpcJsonContext.Default.SetAllowPairingMessage),
                "update" => JsonSerializer.SerializeToUtf8Bytes((UpdateMessage)message, IpcJsonContext.Default.UpdateMessage),
                "welcome" => JsonSerializer.SerializeToUtf8Bytes((WelcomeMessage)message, IpcJsonContext.Default.WelcomeMessage),
                _ => throw new Exception("Invalid message command"),
            };
        }
    }

    [JsonSerializable(typeof(ConnectionAddedMessage))]
    [JsonSerializable(typeof(ConnectionRemovedMessage))]
    [JsonSerializable(typeof(ConnectionVerifiedMessage))]
    [JsonSerializable(typeof(DeleteProfileMessage))]
    [JsonSerializable(typeof(DeleteProfileResultMessage))]
    [JsonSerializable(typeof(EditProfileMessage))]
    [JsonSerializable(typeof(EditProfileMessageResult))]
    [JsonSerializable(typeof(InitializationMessage))]
    [JsonSerializable(typeof(NewProfileMessage))]
    [JsonSerializable(typeof(NewProfileResultMessage))]
    [JsonSerializable(typeof(ProfileAddedMessage))]
    [JsonSerializable(typeof(ProfileChangedMessage))]
    [JsonSerializable(typeof(ProfileRemovedMessage))]
    [JsonSerializable(typeof(ReceivedProfileMessage))]
    [JsonSerializable(typeof(ReceivedProfileResultMessage))]
    [JsonSerializable(typeof(SendProfileMessage))]
    [JsonSerializable(typeof(SetAllowPairingMessage))]
    [JsonSerializable(typeof(UpdateMessage))]
    [JsonSerializable(typeof(WelcomeMessage))]
    internal partial class IpcJsonContext : JsonSerializerContext { }
}

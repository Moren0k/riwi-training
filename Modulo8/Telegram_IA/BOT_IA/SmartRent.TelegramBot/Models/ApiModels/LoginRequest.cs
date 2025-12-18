using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class LoginRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        [JsonPropertyName("password")]
        public string Password { get; set; } = "";
    }
}

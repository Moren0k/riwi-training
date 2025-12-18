using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class AuthResponse
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = "";

        [JsonPropertyName("userId")]
        public string UserId { get; set; } = "";

        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        [JsonPropertyName("role")]
        public string Role { get; set; } = "";
    }
}

using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class RegisterRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        [JsonPropertyName("password")]
        public string Password { get; set; } = "";

        [JsonPropertyName("fullName")]
        public string FullName { get; set; } = "";

        [JsonPropertyName("phone")]
        public string Phone { get; set; } = "";

        [JsonPropertyName("age")]
        public int Age { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; } = "";

        [JsonPropertyName("role")]
        public string Role { get; set; } = "Client";
    }
}

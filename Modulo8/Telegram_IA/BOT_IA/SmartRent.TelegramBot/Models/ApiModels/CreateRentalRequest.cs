using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class CreateRentalRequest
    {
        [JsonPropertyName("carId")]
        public string CarId { get; set; } = "";

        [JsonPropertyName("estimatedHours")]
        public int EstimatedHours { get; set; }

        [JsonPropertyName("clientId")]
        public string ClientId { get; set; } = "";
    }
}

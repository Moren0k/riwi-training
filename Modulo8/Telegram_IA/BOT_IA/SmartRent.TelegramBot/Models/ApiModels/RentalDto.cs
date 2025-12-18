using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class RentalDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = "";

        [JsonPropertyName("carId")]
        public string CarId { get; set; } = "";

        [JsonPropertyName("clientId")]
        public string ClientId { get; set; } = "";

        [JsonPropertyName("estimatedHours")]
        public int EstimatedHours { get; set; }

        [JsonPropertyName("totalPrice")]
        public decimal TotalPrice { get; set; }

        [JsonPropertyName("deposit")]
        public decimal Deposit { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}

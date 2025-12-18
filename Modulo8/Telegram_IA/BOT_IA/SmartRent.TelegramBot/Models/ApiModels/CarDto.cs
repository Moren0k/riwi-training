using System.Text.Json.Serialization;

namespace SmartRent.TelegramBot.Models.ApiModels
{
    public class CarDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = "";

        [JsonPropertyName("brand")]
        public string Brand { get; set; } = "";

        [JsonPropertyName("model")]
        public string Model { get; set; } = "";

        [JsonPropertyName("year")]
        public int Year { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; } = "";

        [JsonPropertyName("plate")]
        public string Plate { get; set; } = "";

        [JsonPropertyName("pricePerHour")]
        public decimal PricePerHour { get; set; }

        [JsonPropertyName("commercialValue")]
        public decimal CommercialValue { get; set; }

        [JsonPropertyName("deposit")]
        public decimal Deposit { get; set; }

        [JsonPropertyName("isAvailable")]
        public bool IsAvailable { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; } = "";

        [JsonPropertyName("photoUrl")]
        public string? PhotoUrl { get; set; }

        [JsonPropertyName("companyId")]
        public string CompanyId { get; set; } = "";

        public string GetDisplayText()
        {
            return $"🚗 {Brand} {Model} ({Year})\n" +
                   $"📍 {City}\n" +
                   $"💰 ${PricePerHour:N0} COP/hora\n" +
                   $"🔖 Depósito: ${Deposit:N0} COP\n" +
                   $"🎨 Color: {Color}\n" +
                   $"🆔 Placa: {Plate}";
        }
    }
}

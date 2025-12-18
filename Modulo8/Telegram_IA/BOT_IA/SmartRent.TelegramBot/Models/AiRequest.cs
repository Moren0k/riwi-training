namespace SmartRent.TelegramBot.Models
{
    public class AiRequest
    {
        public string Language { get; set; } = "es";
        public string Message { get; set; } = "";
        public string? City { get; set; }
        public string? VehicleType { get; set; }
        public long? Budget { get; set; }
        public bool DocumentsVerified { get; set; }
    }
}
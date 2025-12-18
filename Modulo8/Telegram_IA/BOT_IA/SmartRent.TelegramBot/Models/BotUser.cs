namespace SmartRent.TelegramBot.Models
{
    public class BotUser
    {
        public long ChatId { get; set; }
        public string Username { get; set; } = "";
        
        public string Language { get; set; } = "es";

        public ConversationStep Step { get; set; } = ConversationStep.None;

        public string? City { get; set; }
        public string? VehicleType { get; set; }
        public long? Budget { get; set; }

        // NUEVOS CAMPOS
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public int? Age { get; set; }

        public bool DocumentsVerified { get; set; } = false;

        // API Integration fields
        public string? Email { get; set; }
        public string? ApiPassword { get; set; }
        public string? ApiUserId { get; set; }
        public string? ApiToken { get; set; }
        
        // Selected vehicle for rental
        public string? SelectedVehicleId { get; set; }
    }
}
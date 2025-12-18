namespace SmartRent.TelegramBot.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public long ChatId { get; set; }
        public MessageSender Sender { get; set; }
        public string Text { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
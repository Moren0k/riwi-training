namespace SmartRent.TelegramBot.Models
{
    public enum ConversationStep
    {
        None,
        AskingCity,
        AskingVehicleType,
        AskingBudget,
        AskingFullName,
        AskingPhone,
        AskingAge,
        AskingEmail,
        AskingPassword,
        ReadyForRecommendations,
        BrowsingVehicles,
        SelectingVehicle,
        AskingRentalDuration,
        ConfirmingRental
    }
}
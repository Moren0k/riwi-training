namespace TalentoPlus.Application.Auth.Dtos;

public class RegisterEmployeeAccountRequestDto
{
    public string DocumentNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }
}
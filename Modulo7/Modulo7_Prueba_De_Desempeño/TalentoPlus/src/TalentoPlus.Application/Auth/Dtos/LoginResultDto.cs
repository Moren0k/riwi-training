namespace TalentoPlus.Application.Auth.Dtos;

public class LoginResultDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }

    public bool IsAdmin { get; set; }

    public int EmployeeId { get; set; }
    public string FullName { get; set; } = string.Empty;
}
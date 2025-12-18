namespace TalentoPlus.Application.Employees.Public.Dtos;

public class PublicEmployeeRegisterRequestDto
{
    public string DocumentNumber { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public DateTime? BirthDate { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public int DepartmentId { get; set; }

    public string Password { get; set; } = string.Empty;
}
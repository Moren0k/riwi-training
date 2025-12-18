namespace TalentoPlus.Application.Employees.Common;

public class EmployeeProfileDto
{
    public int Id { get; set; }

    public string DocumentNumber { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public string Position { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;

    public decimal Salary { get; set; }

    public DateTime HireDate { get; set; }

    public string Status { get; set; } = string.Empty;
    public string EducationLevel { get; set; } = string.Empty;

    public string ProfessionalProfile { get; set; } = string.Empty;
}
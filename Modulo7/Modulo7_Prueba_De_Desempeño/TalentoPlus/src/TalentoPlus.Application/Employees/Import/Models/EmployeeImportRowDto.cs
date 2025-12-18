namespace TalentoPlus.Application.Employees.Import.Models;

public class EmployeeImportRowDto
{
    public string Document { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string BirthDate { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string Position { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public string HireDate { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
    public string EducationLevel { get; set; } = string.Empty;
    public string ProfessionalProfile { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public int RowNumber { get; set; }
}
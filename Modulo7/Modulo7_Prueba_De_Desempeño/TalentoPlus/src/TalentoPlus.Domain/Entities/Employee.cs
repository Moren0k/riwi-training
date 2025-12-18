using TalentoPlus.Domain.Common;
using TalentoPlus.Domain.Enums;

namespace TalentoPlus.Domain.Entities;

public class Employee : BaseEntity
{
    public string DocumentNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }

    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public EmployeePosition Position { get; set; }
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
    public EmployeeStatus Status { get; set; }

    public EmployeeEducationLevel EducationLevel { get; set; }
    public string ProfessionalProfile { get; set; } = string.Empty;

    public int DepartmentId { get; set; }
    public Department? Department { get; set; }
}
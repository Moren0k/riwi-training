using TalentoPlus.Domain.Entities;
using TalentoPlus.Domain.Enums;

namespace TalentoPlus.Application.Employees.Crud.DTOs;

public class EmployeeUpdateRequestDto
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
    
    // EmployeeAccount
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsAdmin { get; set; }
}
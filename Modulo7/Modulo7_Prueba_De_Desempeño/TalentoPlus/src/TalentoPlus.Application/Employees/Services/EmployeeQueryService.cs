using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Employees.Common;
using TalentoPlus.Application.Employees.Interfaces;

namespace TalentoPlus.Application.Employees.Services;

public class EmployeeQueryService : IEmployeeQueryService
{
    private readonly IEmployeeRepository _employeeRepository;

    public EmployeeQueryService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<EmployeeProfileDto> GetProfileAsync(int employeeId, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId, cancellationToken)
                       ?? throw new InvalidOperationException("Employee not found.");

        return new EmployeeProfileDto
        {
            Id = employee.Id,
            DocumentNumber = employee.DocumentNumber,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            Email = employee.Email,
            Phone = employee.Phone,
            Position = employee.Position.ToString(),
            Department = employee.Department.Name,
            Salary = employee.Salary,
            HireDate = employee.HireDate,
            Status = employee.Status.ToString(),
            EducationLevel = employee.EducationLevel.ToString(),
            ProfessionalProfile = employee.ProfessionalProfile
        };
    }
}
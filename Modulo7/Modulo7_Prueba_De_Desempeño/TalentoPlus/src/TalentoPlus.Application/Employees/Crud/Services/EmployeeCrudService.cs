using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Employees.Crud.DTOs;
using TalentoPlus.Application.Employees.Crud.Interfaces;

namespace TalentoPlus.Application.Employees.Crud.Services;

public class EmployeeCrudService : IEmployeeCrudService
{
    private readonly IEmployeeRepository _employeeRepository;

    public EmployeeCrudService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<bool> UpdateEmployee(string employeeDocument, EmployeeUpdateRequestDto request, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByDocumentAsync(employeeDocument, cancellationToken) ??
                       throw new InvalidOperationException("Employee not found.");
        
        _employeeRepository.Update(employee, cancellationToken);
        return true;
    }

    public void RemoveEmployee(string employeeDocument, CancellationToken cancellationToken)
    {
        var employee = _employeeRepository.GetByDocumentAsync(employeeDocument, cancellationToken) ??
                       throw new InvalidOperationException("Employee not found.");
        
        _employeeRepository.Remove(employee, cancellationToken);
        
        return;
    }
}
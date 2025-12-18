using TalentoPlus.Application.Employees.Crud.DTOs;

namespace TalentoPlus.Application.Employees.Crud.Interfaces;

public interface IEmployeeCrudService
{
    Task<bool> UpdateEmployee(string employeeDocument, EmployeeUpdateRequestDto request, CancellationToken cancellationToken);
    void RemoveEmployee(string employeeDocument, CancellationToken cancellationToken);
}
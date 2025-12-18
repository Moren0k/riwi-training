using TalentoPlus.Application.Employees.Common;

namespace TalentoPlus.Application.Employees.Interfaces;

public interface IEmployeeQueryService
{
    Task<EmployeeProfileDto> GetProfileAsync(int employeeId, CancellationToken cancellationToken);
}
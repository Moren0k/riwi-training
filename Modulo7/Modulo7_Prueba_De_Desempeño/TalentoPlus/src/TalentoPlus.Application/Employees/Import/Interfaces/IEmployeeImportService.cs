using TalentoPlus.Application.Employees.Import.Models;

namespace TalentoPlus.Application.Employees.Import.Interfaces;


public interface IEmployeeImportService
{
    Task<EmployeeImportResult> ImportAsync(
        IEnumerable<EmployeeImportRowDto> rows,
        CancellationToken cancellationToken = default);
}
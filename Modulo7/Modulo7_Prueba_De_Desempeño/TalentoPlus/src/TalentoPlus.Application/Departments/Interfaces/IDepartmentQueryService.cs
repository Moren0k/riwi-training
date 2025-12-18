using TalentoPlus.Application.Departments.Dtos;

namespace TalentoPlus.Application.Departments.Interfaces;

public interface IDepartmentQueryService
{
    Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Departments.Dtos;
using TalentoPlus.Application.Departments.Interfaces;

namespace TalentoPlus.Application.Departments.Services;

public class DepartmentQueryService : IDepartmentQueryService
{
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentQueryService(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }

    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var departments = await _departmentRepository.GetAllAsync(cancellationToken);

        return departments
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name
            })
            .ToList();
    }
}
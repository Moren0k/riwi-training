using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Abstractions.Persistence;

public interface IDepartmentRepository
{
    Task<Department?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Department?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    Task AddAsync(Department department, CancellationToken cancellationToken = default);
    Task<List<Department>> GetAllAsync(CancellationToken cancellationToken = default);
}
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Abstractions.Persistence;

public interface IEmployeeRepository
{
    Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Employee?> GetByDocumentAsync(string documentNumber, CancellationToken cancellationToken = default);
    Task<bool> ExistsByDocumentOrEmailAsync(string documentNumber, string email, CancellationToken cancellationToken = default);

    Task AddAsync(Employee employee, CancellationToken cancellationToken = default);
    void Update(Employee employee, CancellationToken cancellationToken = default);
    void Remove(Task<Employee?> employee, CancellationToken cancellationToken = default);
}
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Abstractions.Persistence;

public interface IEmployeeAccountRepository
{
    Task<EmployeeAccount?> GetByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default);
    Task<EmployeeAccount?> GetByDocumentAndEmailAsync(string documentNumber, string email, CancellationToken cancellationToken = default);

    Task AddAsync(EmployeeAccount account, CancellationToken cancellationToken = default);
    void Update(EmployeeAccount account);
}
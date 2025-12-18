using Microsoft.EntityFrameworkCore;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Persistence.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly TalentoPlusDbContext _context;

    public EmployeeRepository(TalentoPlusDbContext context)
    {
        _context = context;
    }

    public async Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Employees
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<Employee?> GetByDocumentAsync(string documentNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Employees
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber, cancellationToken);
    }

    public async Task<bool> ExistsByDocumentOrEmailAsync(string documentNumber, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Employees
            .AnyAsync(e => e.DocumentNumber == documentNumber || e.Email == email, cancellationToken);
    }

    public async Task AddAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        await _context.Employees.AddAsync(employee, cancellationToken);
    }

    public void Update(Employee employee, CancellationToken cancellationToken = default)
    {
        _context.Employees.Update(employee);
    }

    public void Remove(Task<Employee?> employee, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
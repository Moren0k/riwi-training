using Microsoft.EntityFrameworkCore;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Persistence.Repositories;

public class EmployeeAccountRepository : IEmployeeAccountRepository
{
    private readonly TalentoPlusDbContext _context;

    public EmployeeAccountRepository(TalentoPlusDbContext context)
    {
        _context = context;
    }

    public async Task<EmployeeAccount?> GetByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default)
    {
        return await _context.EmployeeAccounts
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId, cancellationToken);
    }

    public async Task<EmployeeAccount?> GetByDocumentAndEmailAsync(string documentNumber, string email, CancellationToken cancellationToken = default)
    {
        return await _context.EmployeeAccounts
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a =>
                    a.Employee.DocumentNumber == documentNumber &&
                    a.Employee.Email == email,
                cancellationToken);
    }

    public async Task AddAsync(EmployeeAccount account, CancellationToken cancellationToken = default)
    {
        await _context.EmployeeAccounts.AddAsync(account, cancellationToken);
    }

    public void Update(EmployeeAccount account)
    {
        _context.EmployeeAccounts.Update(account);
    }
}
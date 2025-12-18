using Microsoft.EntityFrameworkCore;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Persistence.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly TalentoPlusDbContext _context;

    public DepartmentRepository(TalentoPlusDbContext context)
    {
        _context = context;
    }

    public async Task<Department?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Departments
            .Include(d => d.Employees)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<Department?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Departments
            .FirstOrDefaultAsync(d => d.Name == name, cancellationToken);
    }

    public async Task AddAsync(Department department, CancellationToken cancellationToken = default)
    {
        await _context.Departments.AddAsync(department, cancellationToken);
    }

    public async Task<List<Department>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Departments
            .OrderBy(d => d.Name)
            .ToListAsync(cancellationToken);
    }
}
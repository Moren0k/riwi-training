using Microsoft.EntityFrameworkCore;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Persistence;

public class TalentoPlusDbContext : DbContext, IUnitOfWork
{
    public TalentoPlusDbContext(DbContextOptions<TalentoPlusDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<EmployeeAccount> EmployeeAccounts => Set<EmployeeAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TalentoPlusDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }
}
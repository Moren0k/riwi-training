using Microsoft.EntityFrameworkCore;
using TalentoPlus.Application.Reports.Dtos;
using TalentoPlus.Application.Reports.Interfaces;
using TalentoPlus.Domain.Enums;
using TalentoPlus.Infrastructure.Persistence;

namespace TalentoPlus.Infrastructure.Reports;

public class EmployeeReportService : IEmployeeReportService
{
    private readonly TalentoPlusDbContext _context;

    public EmployeeReportService(TalentoPlusDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardMetricsDto> GetDashboardMetricsAsync(CancellationToken cancellationToken = default)
    {
        var query = _context.Employees.AsNoTracking();

        var total = await query.CountAsync(cancellationToken);
        var active = await query.CountAsync(e => e.Status == EmployeeStatus.Active, cancellationToken);
        var inactive = await query.CountAsync(e => e.Status == EmployeeStatus.Inactive, cancellationToken);
        var vacation = await query.CountAsync(e => e.Status == EmployeeStatus.Vacation, cancellationToken);

        decimal averageSalary = 0;
        if (total > 0)
        {
            averageSalary = await query.AverageAsync(e => e.Salary, cancellationToken);
        }

        var departmentsCount = await _context.Departments
            .AsNoTracking()
            .CountAsync(cancellationToken);

        return new DashboardMetricsDto
        {
            TotalEmployees = total,
            ActiveEmployees = active,
            InactiveEmployees = inactive,
            OnVacationEmployees = vacation,
            AverageSalary = Math.Round(averageSalary, 2),
            DepartmentsCount = departmentsCount
        };
    }
}
using TalentoPlus.Application.Reports.Dtos;

namespace TalentoPlus.Application.Reports.Interfaces;

public interface IEmployeeReportService
{
    Task<DashboardMetricsDto> GetDashboardMetricsAsync(CancellationToken cancellationToken = default);
}
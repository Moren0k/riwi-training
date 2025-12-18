using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentoPlus.Application.Reports.Interfaces;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize] // Requiere JWT
public class AdminDashboardController : ControllerBase
{
    private readonly IEmployeeReportService _reportService;

    public AdminDashboardController(IEmployeeReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics(CancellationToken cancellationToken)
    {
        // Verificar claim de admin
        var isAdminClaim = User.FindFirst("isAdmin")?.Value;

        if (!bool.TryParse(isAdminClaim, out var isAdmin) || !isAdmin)
            return Forbid(); // 403 si no es admin

        var metrics = await _reportService.GetDashboardMetricsAsync(cancellationToken);

        return Ok(metrics);
    }
}
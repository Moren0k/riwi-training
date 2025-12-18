using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentoPlus.Application.Employees.Cv.Services;
using TalentoPlus.Application.Employees.Interfaces;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/employees")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeQueryService _employeeQueryService;
    private readonly EmployeeCvService _cvService;

    public EmployeesController(
        IEmployeeQueryService employeeQueryService,
        EmployeeCvService cvService)
    {
        _employeeQueryService = employeeQueryService;
        _cvService = cvService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var employeeIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue("sub");

        if (!int.TryParse(employeeIdClaim, out var employeeId))
            return Unauthorized();

        var profile = await _employeeQueryService.GetProfileAsync(employeeId, cancellationToken);

        return Ok(profile);
    }
    
    [HttpGet("me/cv")]
    public async Task<IActionResult> DownloadMyCv(CancellationToken cancellationToken)
    {
        var employeeIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!int.TryParse(employeeIdClaim, out var employeeId))
            return Unauthorized();

        var pdfBytes = await _cvService.GenerateMyCvAsync(employeeId, cancellationToken);

        return File(pdfBytes, "application/pdf", "cv.pdf");
    }
}
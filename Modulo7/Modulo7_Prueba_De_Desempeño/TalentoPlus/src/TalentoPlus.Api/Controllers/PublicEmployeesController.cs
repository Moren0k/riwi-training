using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentoPlus.Application.Employees.Public.Dtos;
using TalentoPlus.Application.Employees.Public.Interfaces;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/public/employees")]
public class PublicEmployeesController : ControllerBase
{
    private readonly IEmployeePublicRegistrationService _registrationService;

    public PublicEmployeesController(IEmployeePublicRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] PublicEmployeeRegisterRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            await _registrationService.RegisterAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }
    }
}
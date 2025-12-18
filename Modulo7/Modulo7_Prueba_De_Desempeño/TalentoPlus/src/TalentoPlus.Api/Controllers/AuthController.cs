using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentoPlus.Application.Auth.Dtos;
using TalentoPlus.Application.Auth.Interfaces;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.LoginAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register-account")]
    [Authorize]
    public async Task<IActionResult> RegisterAccount(
        [FromBody] RegisterEmployeeAccountRequestDto request,
        CancellationToken cancellationToken)
    {
        var isAdminClaim = User.FindFirst("isAdmin")?.Value;

        if (!bool.TryParse(isAdminClaim, out var isAdmin) || !isAdmin)
        {
            return Forbid();
        }

        try
        {
            await _authService.RegisterEmployeeAccountAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }
    }
}

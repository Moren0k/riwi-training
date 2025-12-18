using TalentoPlus.Application.Auth.Dtos;

namespace TalentoPlus.Application.Auth.Interfaces;

public interface IAuthService
{
    Task<LoginResultDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    
    Task RegisterEmployeeAccountAsync(
        RegisterEmployeeAccountRequestDto request,
        CancellationToken cancellationToken = default);
}
using TalentoPlus.Application.Employees.Public.Dtos;

namespace TalentoPlus.Application.Employees.Public.Interfaces;

public interface IEmployeePublicRegistrationService
{
    Task RegisterAsync(PublicEmployeeRegisterRequestDto request, CancellationToken cancellationToken = default);
}
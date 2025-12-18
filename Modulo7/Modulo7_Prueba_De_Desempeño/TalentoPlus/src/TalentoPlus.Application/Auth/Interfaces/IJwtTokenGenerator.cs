using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Auth.Interfaces;


public interface IJwtTokenGenerator
{
    string GenerateToken(Employee employee, EmployeeAccount account);
}
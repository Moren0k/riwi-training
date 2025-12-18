using Microsoft.Extensions.DependencyInjection;
using TalentoPlus.Application.Auth.Interfaces;
using TalentoPlus.Application.Auth.Services;
using TalentoPlus.Application.Departments.Interfaces;
using TalentoPlus.Application.Departments.Services;
using TalentoPlus.Application.Employees.Cv.Services;
using TalentoPlus.Application.Employees.Interfaces;
using TalentoPlus.Application.Employees.Public.Interfaces;
using TalentoPlus.Application.Employees.Public.Services;
using TalentoPlus.Application.Employees.Services;

namespace TalentoPlus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEmployeeQueryService, EmployeeQueryService>();
        services.AddScoped<EmployeeCvService>();
        services.AddScoped<IDepartmentQueryService, DepartmentQueryService>();
        services.AddScoped<IEmployeePublicRegistrationService, EmployeePublicRegistrationService>();
        
        return services;
    }
}
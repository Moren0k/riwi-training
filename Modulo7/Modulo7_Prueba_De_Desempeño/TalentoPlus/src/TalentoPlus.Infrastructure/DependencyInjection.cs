using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TalentoPlus.Application.Abstractions.Notifications;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Abstractions.Security;
using TalentoPlus.Application.Auth.Interfaces;
using TalentoPlus.Application.Employees.Cv.Interfaces;
using TalentoPlus.Application.Reports.Interfaces;
using TalentoPlus.Infrastructure.Email;
using TalentoPlus.Infrastructure.Employees.Cv;
using TalentoPlus.Infrastructure.Persistence;
using TalentoPlus.Infrastructure.Persistence.Repositories;
using TalentoPlus.Infrastructure.Reports;
using TalentoPlus.Infrastructure.Security;

namespace TalentoPlus.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
                               ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<TalentoPlusDbContext>(options =>
        {
            options.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString));
        });

        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IEmployeeAccountRepository, EmployeeAccountRepository>();
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<TalentoPlusDbContext>());
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IEmployeeReportService, EmployeeReportService>();
        services.AddScoped<ICvPdfGenerator, QuestPdfCvGenerator>();
        // SMTP
        services.Configure<SmtpSettings>(configuration.GetSection("Smtp"));
        services.AddScoped<IEmailSender, SmtpEmailSender>();
        
        return services;
    }
}
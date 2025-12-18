using TalentoPlus.Application.Abstractions.Notifications;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Employees.Public.Dtos;
using TalentoPlus.Application.Employees.Public.Interfaces;
using TalentoPlus.Application.Abstractions.Security;
using TalentoPlus.Domain.Entities;
using TalentoPlus.Domain.Enums;

namespace TalentoPlus.Application.Employees.Public.Services;

public class EmployeePublicRegistrationService : IEmployeePublicRegistrationService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IEmployeeAccountRepository _accountRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailSender _emailSender;

    public EmployeePublicRegistrationService(
        IEmployeeRepository employeeRepository,
        IEmployeeAccountRepository accountRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork,
        IEmailSender emailSender)
    {
        _employeeRepository = employeeRepository;
        _accountRepository = accountRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
        _emailSender = emailSender;
    }

    public async Task RegisterAsync(PublicEmployeeRegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.DocumentNumber))
            throw new ArgumentException("DocumentNumber is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.");

        var existingEmployee = await _employeeRepository
            .GetByDocumentAsync(request.DocumentNumber, cancellationToken);

        if (existingEmployee is not null)
            throw new InvalidOperationException("An employee with this document already exists.");

        var employee = new Employee
        {
            DocumentNumber = request.DocumentNumber,
            FirstName = request.FirstName,
            LastName = request.LastName,
            BirthDate = request.BirthDate ?? DateTime.UtcNow.Date,
            Address = request.Address,
            Phone = request.Phone,
            Email = request.Email,
            DepartmentId = request.DepartmentId,

            Position = EmployeePosition.Assistant,
            Salary = 0,
            HireDate = DateTime.UtcNow.Date,
            Status = EmployeeStatus.Active,
            EducationLevel = EmployeeEducationLevel.Professional,
            ProfessionalProfile = string.Empty
        };

        await _employeeRepository.AddAsync(employee, cancellationToken);

        var passwordHash = _passwordHasher.HashPassword(request.Password);

        var account = new EmployeeAccount
        {
            Employee = employee,
            PasswordHash = passwordHash,
            IsAdmin = false,
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        await _accountRepository.AddAsync(account, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var subject = "Bienvenido a TalentoPlus";
        var body =
            $"Hola {employee.FirstName},\n\n" +
            "Tu registro en TalentoPlus fue exitoso.\n" +
            "Podrás autenticarse en la plataforma cuando tu cuenta sea habilitada por el administrador.\n\n" +
            "Saludos,\nTalentoPlus";

        await _emailSender.SendAsync(employee.Email, subject, body, cancellationToken);
    }
}
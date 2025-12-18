using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Abstractions.Security;
using TalentoPlus.Application.Auth.Dtos;
using TalentoPlus.Application.Auth.Interfaces;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IEmployeeAccountRepository _accountRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IEmployeeAccountRepository accountRepository,
        IEmployeeRepository employeeRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _accountRepository = accountRepository;
        _employeeRepository = employeeRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<LoginResultDto> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var account = await _accountRepository
            .GetByDocumentAndEmailAsync(request.DocumentNumber, request.Email, cancellationToken);

        if (account is null)
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!account.IsActive)
            throw new UnauthorizedAccessException("Account is disabled.");

        var validPassword = _passwordHasher.VerifyHashedPassword(
            account.PasswordHash,
            request.Password);

        if (!validPassword)
            throw new UnauthorizedAccessException("Invalid credentials.");

        var token = _jwtTokenGenerator.GenerateToken(account.Employee, account);

        return new LoginResultDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddHours(3),
            IsAdmin = account.IsAdmin,
            EmployeeId = account.EmployeeId,
            FullName = $"{account.Employee.FirstName} {account.Employee.LastName}"
        };
    }

    public async Task RegisterEmployeeAccountAsync(
        RegisterEmployeeAccountRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.DocumentNumber))
            throw new ArgumentException("DocumentNumber is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.");

        // 1. Buscar empleado por documento
        var employee = await _employeeRepository
            .GetByDocumentAsync(request.DocumentNumber, cancellationToken);

        if (employee is null)
            throw new InvalidOperationException("Employee not found.");

        // 2. Verificar que el email coincida
        if (!string.Equals(employee.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Email does not match the employee record.");

        // 3. Verificar que no exista ya una cuenta para ese empleado
        var existingAccount = await _accountRepository
            .GetByEmployeeIdAsync(employee.Id, cancellationToken);

        if (existingAccount is not null)
            throw new InvalidOperationException("An account already exists for this employee.");

        // 4. Crear cuenta
        var passwordHash = _passwordHasher.HashPassword(request.Password);

        var account = new EmployeeAccount
        {
            EmployeeId = employee.Id,
            PasswordHash = passwordHash,
            IsActive = true,
            IsAdmin = request.IsAdmin,
            CreatedAt = DateTime.UtcNow
        };

        await _accountRepository.AddAsync(account, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
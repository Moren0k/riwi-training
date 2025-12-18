using System.Globalization;
using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Employees.Import.Interfaces;
using TalentoPlus.Application.Employees.Import.Models;
using TalentoPlus.Domain.Entities;
using TalentoPlus.Domain.Enums;

namespace TalentoPlus.Application.Employees.Import.Services;

public class EmployeeImportService : IEmployeeImportService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EmployeeImportService(
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<EmployeeImportResult> ImportAsync(
        IEnumerable<EmployeeImportRowDto> rows,
        CancellationToken cancellationToken = default)
    {
        var result = new EmployeeImportResult();
        var rowList = rows.ToList();

        result.TotalRows = rowList.Count;

        if (!rowList.Any())
            return result;

        var departmentMap = await PrepareDepartmentsAsync(rowList, cancellationToken);

        foreach (var row in rowList)
        {
            try
            {
                await ProcessEmployeeRowAsync(row, departmentMap, cancellationToken);
                result.SuccessCount++;
            }
            catch (Exception ex)
            {
                result.Errors.Add(new EmployeeImportError
                {
                    RowNumber = row.RowNumber,
                    Message = ex.Message
                });
            }
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return result;
    }

    private async Task<Dictionary<string, int>> PrepareDepartmentsAsync(
        List<EmployeeImportRowDto> rows,
        CancellationToken cancellationToken)
    {
        var departmentNames = rows
            .Select(r => NormalizeDepartmentName(r.Department))
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var map = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        var existingDepartments = await _departmentRepository.GetAllAsync(cancellationToken);

        foreach (var existing in existingDepartments)
        {
            var normalized = existing.Name.Trim();
            if (!map.ContainsKey(normalized))
                map[normalized] = existing.Id;
        }

        foreach (var name in departmentNames)
        {
            if (map.ContainsKey(name))
                continue;

            var department = new Department
            {
                Name = name
            };

            await _departmentRepository.AddAsync(department, cancellationToken);

            map[name] = -1;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var allDepartments = await _departmentRepository.GetAllAsync(cancellationToken);

        map.Clear();
        foreach (var dep in allDepartments)
        {
            var normalized = dep.Name.Trim();
            map[normalized] = dep.Id;
        }

        return map;
    }

    private async Task ProcessEmployeeRowAsync(
        EmployeeImportRowDto row,
        Dictionary<string, int> departmentMap,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(row.Document))
            throw new ArgumentException("Document is required.");

        if (string.IsNullOrWhiteSpace(row.Email))
            throw new ArgumentException("Email is required.");

        var exists = await _employeeRepository
            .ExistsByDocumentOrEmailAsync(row.Document, row.Email, cancellationToken);

        if (exists)
            throw new InvalidOperationException("Employee with same document or email already exists.");

        var normalizedDepartment = NormalizeDepartmentName(row.Department);

        if (!departmentMap.TryGetValue(normalizedDepartment, out var departmentId))
            throw new InvalidOperationException($"Department '{normalizedDepartment}' not found.");

        var employee = MapRowToEmployee(row, departmentId);

        await _employeeRepository.AddAsync(employee, cancellationToken);
    }

    private static string NormalizeDepartmentName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "Sin departamento";

        return name.Trim();
    }

    private static Employee MapRowToEmployee(EmployeeImportRowDto row, int departmentId)
    {
        return new Employee
        {
            DocumentNumber = row.Document.Trim(),
            FirstName = row.FirstName.Trim(),
            LastName = row.LastName.Trim(),
            BirthDate = ParseDate(row.BirthDate),
            Address = row.Address?.Trim() ?? string.Empty,
            Phone = row.Phone?.Trim() ?? string.Empty,
            Email = row.Email.Trim(),
            Position = ParsePosition(row.Position),
            Salary = ParseDecimal(row.Salary),
            HireDate = ParseDate(row.HireDate),
            Status = ParseStatus(row.Status),
            EducationLevel = ParseEducationLevel(row.EducationLevel),
            ProfessionalProfile = row.ProfessionalProfile?.Trim() ?? string.Empty,
            DepartmentId = departmentId
        };
    }

    private static DateTime ParseDate(string input)
    {
        if (DateTime.TryParse(input, new CultureInfo("es-CO"), DateTimeStyles.None, out var date))
            return date;

        if (DateTime.TryParse(input, CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            return date;

        throw new ArgumentException($"Invalid date value: '{input}'.");
    }

    private static decimal ParseDecimal(string input)
    {
        var es = new CultureInfo("es-CO");

        if (decimal.TryParse(input, NumberStyles.Any, es, out var value))
            return value;

        if (decimal.TryParse(input, NumberStyles.Any, CultureInfo.InvariantCulture, out value))
            return value;

        throw new ArgumentException($"Invalid decimal value: '{input}'.");
    }

    private static readonly Dictionary<string, EmployeePosition> PositionMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Administrador"] = EmployeePosition.Administrator,
            ["Administrador(a)"] = EmployeePosition.Administrator,
            ["Analista"] = EmployeePosition.Analyst,
            ["Asistente"] = EmployeePosition.Assistant,
            ["Coordinador"] = EmployeePosition.Coordinator,
            ["Coordinador(a)"] = EmployeePosition.Coordinator,
            ["Desarrollador"] = EmployeePosition.Developer,
            ["Ingeniero"] = EmployeePosition.Engineer,
            ["Soporte Técnico"] = EmployeePosition.TechnicalSupport,
            ["Soporte Tecnico"] = EmployeePosition.TechnicalSupport,
            ["Auxiliar"] = EmployeePosition.Assistant,
        };

    private static readonly Dictionary<string, EmployeeStatus> StatusMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Activo"] = EmployeeStatus.Active,
            ["Inactivo"] = EmployeeStatus.Inactive,
            ["Vacaciones"] = EmployeeStatus.Vacation
        };

    private static readonly Dictionary<string, EmployeeEducationLevel> EducationMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Especialización"] = EmployeeEducationLevel.Specialization,
            ["Especializacion"] = EmployeeEducationLevel.Specialization,
            ["Maestría"] = EmployeeEducationLevel.Master,
            ["Maestria"] = EmployeeEducationLevel.Master,
            ["Profesional"] = EmployeeEducationLevel.Professional,
            ["Técnico"] = EmployeeEducationLevel.Technician,
            ["Tecnico"] = EmployeeEducationLevel.Technician,
            ["Tecnólogo"] = EmployeeEducationLevel.Technologist,
            ["Tecnologo"] = EmployeeEducationLevel.Technologist
        };

    private static EmployeePosition ParsePosition(string input)
    {
        if (PositionMap.TryGetValue(input.Trim(), out var position))
            return position;

        throw new ArgumentException($"Invalid position value: '{input}'.");
    }

    private static EmployeeStatus ParseStatus(string input)
    {
        if (StatusMap.TryGetValue(input.Trim(), out var status))
            return status;

        throw new ArgumentException($"Invalid status value: '{input}'.");
    }

    private static EmployeeEducationLevel ParseEducationLevel(string input)
    {
        if (EducationMap.TryGetValue(input.Trim(), out var level))
            return level;

        throw new ArgumentException($"Invalid education level value: '{input}'.");
    }
}
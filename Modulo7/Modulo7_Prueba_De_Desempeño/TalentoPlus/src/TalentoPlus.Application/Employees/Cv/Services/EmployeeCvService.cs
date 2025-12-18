using TalentoPlus.Application.Abstractions.Persistence;
using TalentoPlus.Application.Employees.Cv.Interfaces;

namespace TalentoPlus.Application.Employees.Cv.Services;

public class EmployeeCvService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICvPdfGenerator _cvPdfGenerator;

    public EmployeeCvService(
        IEmployeeRepository employeeRepository,
        ICvPdfGenerator cvPdfGenerator)
    {
        _employeeRepository = employeeRepository;
        _cvPdfGenerator = cvPdfGenerator;
    }

    public async Task<byte[]> GenerateMyCvAsync(int employeeId, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId, cancellationToken)
                       ?? throw new InvalidOperationException("Employee not found.");

        return _cvPdfGenerator.Generate(employee);
    }
}
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using TalentoPlus.Application.Employees.Import.Interfaces;
using TalentoPlus.Application.Employees.Import.Models;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/admin/employees/import")]
public class EmployeeImportController : ControllerBase
{
    private readonly IEmployeeImportService _employeeImportService;

    public EmployeeImportController(IEmployeeImportService employeeImportService)
    {
        _employeeImportService = employeeImportService;
    }

    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> ImportEmployees([FromForm] IFormFile file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is required.");

        if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only .xlsx files are supported.");

        var rows = new List<EmployeeImportRowDto>();

        using (var stream = file.OpenReadStream())
        using (var workbook = new XLWorkbook(stream))
        {
            var worksheet = workbook.Worksheets.First();

            var rowNumber = 0;
            foreach (var row in worksheet.RowsUsed())
            {
                rowNumber++;

                if (rowNumber == 1)
                    continue;

                var dto = new EmployeeImportRowDto
                {
                    RowNumber = rowNumber,
                    Document           = row.Cell(1).GetString(),
                    FirstName          = row.Cell(2).GetString(),
                    LastName           = row.Cell(3).GetString(),
                    BirthDate          = row.Cell(4).GetString(),
                    Address            = row.Cell(5).GetString(),
                    Phone              = row.Cell(6).GetString(),
                    Email              = row.Cell(7).GetString(),
                    Position           = row.Cell(8).GetString(),
                    Salary             = row.Cell(9).GetString(),
                    HireDate           = row.Cell(10).GetString(),
                    Status             = row.Cell(11).GetString(),
                    EducationLevel     = row.Cell(12).GetString(),
                    ProfessionalProfile= row.Cell(13).GetString(),
                    Department         = row.Cell(14).GetString()
                };

                rows.Add(dto);
            }
        }

        if (!rows.Any())
            return BadRequest("No data rows found in the Excel file.");

        var result = await _employeeImportService.ImportAsync(rows, cancellationToken);

        return Ok(result);
    }
}

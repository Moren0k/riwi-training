namespace TalentoPlus.Application.Employees.Import.Models;

public class EmployeeImportResult
{
    public int TotalRows { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount => Errors.Count;

    public List<EmployeeImportError> Errors { get; } = new();
}

public class EmployeeImportError
{
    public int RowNumber { get; set; }
    public string Message { get; set; } = string.Empty;
}
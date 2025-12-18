namespace TalentoPlus.Application.Reports.Dtos;

public class DashboardMetricsDto
{
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int InactiveEmployees { get; set; }
    public int OnVacationEmployees { get; set; }

    public decimal AverageSalary { get; set; }

    public int DepartmentsCount { get; set; }
}
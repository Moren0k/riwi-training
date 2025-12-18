using TalentoPlus.Domain.Common;

namespace TalentoPlus.Domain.Entities;

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public List<Employee> Employees { get; set; } = new();
}
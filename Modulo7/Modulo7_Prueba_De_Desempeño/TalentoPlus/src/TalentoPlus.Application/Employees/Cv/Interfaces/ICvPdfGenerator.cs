using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Application.Employees.Cv.Interfaces;

public interface ICvPdfGenerator
{
    byte[] Generate(Employee employee);
}
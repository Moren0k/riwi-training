using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using TalentoPlus.Application.Employees.Cv.Interfaces;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Employees.Cv;

public class QuestPdfCvGenerator : ICvPdfGenerator
{
    public byte[] Generate(Employee employee)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);

                page.Content().Column(column =>
                {
                    column.Spacing(10);

                    column.Item().Text($"{employee.FirstName} {employee.LastName}")
                        .FontSize(20).Bold();

                    column.Item().Text($"Document: {employee.DocumentNumber}");
                    column.Item().Text($"Email: {employee.Email}");
                    column.Item().Text($"Phone: {employee.Phone}");

                    column.Item().LineHorizontal(1);

                    column.Item().Text("Professional Information")
                        .FontSize(14).Bold();

                    column.Item().Text($"Position: {employee.Position}");
                    column.Item().Text($"Department: {employee.Department.Name}");
                    column.Item().Text($"Status: {employee.Status}");
                    column.Item().Text($"Education Level: {employee.EducationLevel}");

                    column.Item().LineHorizontal(1);

                    column.Item().Text("Professional Profile")
                        .FontSize(14).Bold();

                    column.Item().Text(employee.ProfessionalProfile);
                });
            });
        });

        return document.GeneratePdf();
    }
}
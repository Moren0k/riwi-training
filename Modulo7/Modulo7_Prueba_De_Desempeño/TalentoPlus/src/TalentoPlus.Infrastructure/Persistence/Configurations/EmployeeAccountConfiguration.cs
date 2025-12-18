using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentoPlus.Domain.Entities;

namespace TalentoPlus.Infrastructure.Persistence.Configurations;

public class EmployeeAccountConfiguration : IEntityTypeConfiguration<EmployeeAccount>
{
    public void Configure(EntityTypeBuilder<EmployeeAccount> builder)
    {
        builder.ToTable("EmployeeAccounts");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(a => a.IsActive)
            .IsRequired();

        builder.Property(a => a.IsAdmin)
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.HasOne(a => a.Employee)
            .WithOne()
            .HasForeignKey<EmployeeAccount>(a => a.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
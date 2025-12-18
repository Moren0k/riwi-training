using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentoPlus.Application.Departments.Interfaces;

namespace TalentoPlus.Api.Controllers;

[ApiController]
[Route("api/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentQueryService _departmentQueryService;

    public DepartmentsController(IDepartmentQueryService departmentQueryService)
    {
        _departmentQueryService = departmentQueryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var departments = await _departmentQueryService.GetAllAsync(cancellationToken);
        return Ok(departments);
    }
    
    
}
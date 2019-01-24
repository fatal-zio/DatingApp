using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController: ControllerBase
    {
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public IActionResult GetUsersWithRoles() => Ok("Only Admins can see this.");

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotosForModeration() => Ok("Admin or Moderators can see this.");
    }
}
using AutoMapper;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UsersController: ControllerBase
    {
        private readonly IDatingRepository _repo;

        public UsersController(IDatingRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();

            return Ok(Mapper.Map<IEnumerable<UserForListDto>>(users));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            return Ok(Mapper.Map<UserForDetailedDto>(user));
        }
    }
}
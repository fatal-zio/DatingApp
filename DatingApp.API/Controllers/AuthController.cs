using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    /// <summary>
    /// Controller for User Authorization.
    /// </summary>
    [Route("api/auth")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        /// <summary>
        /// constructor, initializes Authentication Repository
        /// </summary>
        /// <param name="repo"></param>
        /// <param name="config"></param>
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        } 

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="userForRegistration"></param>
        /// <returns>201</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegistrationDto userForRegistration)
        {
            userForRegistration.UserName = userForRegistration.UserName.ToLower();

            if (await _repo.UserExists(userForRegistration.UserName))
            {
                return BadRequest("Username already exists");
            }

            var userToCreate = new User {
                UserName = userForRegistration.UserName
            };

            var createdUser = await _repo.Register(userToCreate, userForRegistration.Password);

            return StatusCode(201);
        }

        /// <summary>
        /// Logs into the application.
        /// </summary>
        /// <param name="userForLoginDto">username/password combination</param>
        /// <returns>200 and a Token</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _repo.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.Password);

            if (userForLoginDto == null)
            {
                return Unauthorized();
            }

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });
        }

    }
}
using AutoMapper;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Models;
using System;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/messages")]
    [ApiController]
    [ServiceFilter(typeof(LogUserActivity))]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;

        public MessagesController(IDatingRepository repo) => _repo = repo;

        [HttpGet("{id}", Name = "Getmessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
            {
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;
            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

            if (recipient == null)
            {
                NotFound("Recipient not found.");
            }

            var message = Mapper.Map<Message>(messageForCreationDto);
            _repo.Add(message);

            var messageToReturn = Mapper.Map<MessageForCreationDto>(message);

            return (await _repo.SaveAll()) ? 
                CreatedAtRoute("GetMessage", new {id = message.Id}, messageToReturn) :
                throw new ApplicationException("Error saving message.");
        }
    }
}
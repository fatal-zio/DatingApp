using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegistrationDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Your password must be between 4 and 8 characters.")]
        public string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; private set; }
        public DateTime LastActive { get; private set; }
        public UserForRegistrationDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
     }
}
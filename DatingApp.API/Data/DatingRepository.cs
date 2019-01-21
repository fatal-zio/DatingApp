using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context) => _context = context;

        public void Add<T>(T entity) where T : class => _context.Add(entity);

        public void Delete<T>(T entity) where T : class => _context.Remove(entity);

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(o => o.LikerId == userId && o.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(o => o.UserId == userId).FirstOrDefaultAsync(o => o.IsMain);
        }

        public async Task<Photo> GetPhoto(int id) => 
            await _context.Photos.FirstOrDefaultAsync(o => o.Id == id);

        public async Task<User> GetUser(int id) => 
            await _context.Users.Include(o => o.Photos).FirstOrDefaultAsync(o => o.Id == id);

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(o => o.Photos)
                .OrderByDescending(o => o.LastActive).AsQueryable();

            users = users.Where(o => o.Id != userParams.UserId);
            users = users.Where(o => o.Gender == userParams.Gender);

            if (userParams.Likers) 
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(o => userLikers.Contains(o.Id));
            }

            if (userParams.Likees) 
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(o => userLikees.Contains(o.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(o => o.DateOfBirth >= minDob && o.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created": 
                        users = users.OrderByDescending(o => o.Created);
                        break;
                    default:
                        users = users.OrderByDescending(o => o.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users.Include(o => o.Likers).Include(o => o.Likees)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (likers)
            {
                return user.Likers.Where(o => o.LikeeId == id).Select(o => o.LikerId);
            }
            else
            {
                return user.Likees.Where(o => o.LikerId == id).Select(o => o.LikeeId);
            }
        }   

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(o => o.Id == id);
        }

        public Task<PagedList<Message>> GetMessagesForUser()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            throw new NotImplementedException();
        }
    }
}
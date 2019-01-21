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
            var users = _context.Users.Include(o => o.Photos).AsQueryable();

            users = users.Where(o => o.Id != userParams.UserId);
            users = users.Where(o => o.Gender == userParams.Gender);

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
            

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
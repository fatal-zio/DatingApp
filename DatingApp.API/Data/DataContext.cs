using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base (options)
        {
            
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>()
                .HasKey(o => new {o.LikerId, o.LikeeId});

            builder.Entity<Like>()
                .HasOne(o => o.Likee)
                .WithMany(o => o.Likers)
                .HasForeignKey(o => o.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Like>()
                .HasOne(o => o.Liker)
                .WithMany(o => o.Likees)
                .HasForeignKey(o => o.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(o => o.Sender)
                .WithMany(o => o.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(o => o.Recipient)
                .WithMany(o => o.MessagesRecieved)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
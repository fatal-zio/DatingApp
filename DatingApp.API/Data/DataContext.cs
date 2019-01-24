using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, 
        IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base (options)
        {
            
        }
        
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>(userRole => {
                userRole.HasKey(o => new {o.UserId, o.RoleId});

                userRole.HasOne(o => o.Role)
                    .WithMany(o => o.UserRoles)
                    .HasForeignKey(o => o.RoleId)
                    .IsRequired();

                userRole.HasOne(o => o.User)
                    .WithMany(o => o.UserRoles)
                    .HasForeignKey(o => o.UserId)
                    .IsRequired();
            });

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
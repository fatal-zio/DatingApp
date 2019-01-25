using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            var builder = services.AddIdentityCore<User>(opt => {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters{
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(options => {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin, Moderator"));
                options.AddPolicy("VipOnly", policy => policy.RequireRole("VIP"));
            });

            services.AddMvc(options => 
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => {
                    options.SerializerSettings.ReferenceLoopHandling = 
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddAutoMapper();
            services.AddTransient<Seed>();

            services.AddSpaStaticFiles(config => {
                config.RootPath = "wwwroot";
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info {Title = "DatingApp API", Version = "v1"});

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
            
            services.AddScoped<IDatingRepository, DatingRepository>();

            services.AddScoped<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder => {
                    builder.Run(async context => {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();

                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "DatingApp API V1"); });

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<User, UserForListDto>()
                    .ForMember(d => d.Age, opt => opt.MapFrom(s => s.DateOfBirth.CalculateAge()))
                    .ForMember(d => d.PhotoUrl, opt => opt.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain == true).Url));
                cfg.CreateMap<User, UserForDetailedDto>()
                    .ForMember(d => d.Age, opt => opt.MapFrom(s => s.DateOfBirth.CalculateAge()))
                    .ForMember(d => d.PhotoUrl, opt => opt.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain == true).Url));
                cfg.CreateMap<Photo, PhotoForDetailedDto>();
                cfg.CreateMap<UserForUpdateDto, User>();
                cfg.CreateMap<Photo, PhotoForReturnDto>();
                cfg.CreateMap<PhotoForCreationDto, Photo>();
                cfg.CreateMap<UserForRegistrationDto, User>();
                cfg.CreateMap<MessageForCreationDto, Message>().ReverseMap();
                cfg.CreateMap<Message, MessageToReturnDto>()
                    .ForMember(d => d.SenderPhotoUrl, opt => opt.MapFrom(s => s.Sender.Photos.FirstOrDefault(o => o.IsMain).Url))
                    .ForMember(d => d.RecipientPhotoUrl, opt => opt.MapFrom(s => s.Recipient.Photos.FirstOrDefault(o => o.IsMain).Url));
            });

            // app.UseHttpsRedirection();
            seeder.SeedUsers();
            app.UseCors(o => o.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            

            app.UseAuthentication();
            app.UseMvc();
            app.UseSpa(spa => 
            {
                spa.Options.SourcePath = "wwwroot";
            });
        }
    }
}

using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static string Decode(this string encodedString)
        {
            var decodedBytes = Convert.FromBase64String(encodedString);
            return System.Text.Encoding.UTF8.GetString(decodedBytes);
        }

        public static string Encode(this string unencodedString)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(unencodedString);
            return Convert.ToBase64String(plainTextBytes);
        }

        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Applicaiton-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if(theDateTime.AddYears(age) > DateTime.Today)
            {
                age--;
            }

            return age;
        }
    }
}
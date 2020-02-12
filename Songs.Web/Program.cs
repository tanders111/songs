using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Songs.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Controllers.TagTester.Test(args);return;
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddCommandLine(args)
                .Build();

            var builder = Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var hostUrls = configuration["hosturls"]; 
                                  
                    if (!string.IsNullOrEmpty(hostUrls)) {
                        var list = hostUrls.Split(',');

                       //webBuilder.UseUrls("http://localhost:5080", hostUrl);
                       webBuilder.UseUrls(list);
                    }
                    webBuilder.UseStartup<Startup>();
                });

            return builder;

        }
    }
}

using System;
using System.Text;
using System.Text.RegularExpressions;
using IO = System.IO;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace Songs.Web.Controllers
{
    [ApiController]
    [Route("api")]
    public class SongsController : ControllerBase
    {
        private string Home { get; set; } = @"c:\dev\songs\files";

        private readonly ILogger<SongsController> _logger;
        private IWebHostEnvironment hostingEnvironment;
        public SongsController(ILogger<SongsController> logger, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            this.hostingEnvironment = hostingEnvironment;
            var root = hostingEnvironment.ContentRootPath;
            Home = $"{root}/files";
        }

        [HttpGet]
        [Route("songs/{name}")]
        public IActionResult GetSong(string name)
        {
            var lines = GetSongLines(name);

            var rv = new { lines, name };

            return Ok(rv);
        }

        [HttpGet]
        [Route("songs")]
        public IEnumerable<SongSummary> GetSongs()
        {
//var sw = new System.Diagnostics.Stopwatch();sw.Start();
            var songs = new List<SongSummary>();

            var files = IO.Directory.GetFiles(Home);

            foreach (var f in files)
            { 
                var fileName = new IO.FileInfo(f).Name;
                var song = GetSongSummary(fileName);
                        
                songs.Add(song);
            }
//Console.WriteLine($"-------------got songs in {sw.ElapsedMilliseconds}");
            return songs;
        }

        private SongSummary GetSongSummary(string fileName)
        {
            var songPath = IO.Path.Combine(Home, fileName);
            var txt = IO.File.ReadAllText(songPath, Encoding.UTF8);

            new List<string> { "\n", "\r", ".", ",", "\"", "(", ")"}.ForEach(s => txt = txt.Replace(s, " "));

            var txtSansLines = Regex.Replace(txt, @"\s+", " ");

            var tokens = GetSearchTokens(txt.Trim());

            var headerLength = txtSansLines.IndexOf("---");
            
            var headerTxt = headerLength < 0 ? "" : txtSansLines.Substring(0, headerLength);

            var title = GetTag("@title", headerTxt) ?? fileName.Replace(".txt", "");

            var artist = GetTag("@artist", headerTxt);
            
            var bpm = GetTag("@bpm", headerTxt);

            var note = GetTag("@note", headerTxt);

            if (headerTxt.IndexOf("@") < 0)
                note = headerTxt;


            return new SongSummary
            {
                Title = title,
                Artist = artist,
                File = fileName,
                SearchTokens = tokens,
                Bpm = bpm,
                Note = note
            };


        }

        private string[] GetSongLines(string songPath)
        {
            var song = IO.Path.Join(Home, songPath);
            var txt = IO.File.ReadAllText(song);

            var lines = IO.File.ReadLines(song).ToArray();;

            return lines;
        }
        
        public List<string> GetSearchTokens(string txt)
        {
            var searchTokens = new HashSet<string>();

            var words = txt.Split(" ");

            foreach (var w in words)
            {
                var word = w.Trim();

                if  ( 
                    word.Length > 2 && 
                    word[0] !='@' && 
                    !searchTokens.Contains(word) && 
                    !blackTokens.Contains(word)
                )
                {
                    var ignore = false;
                    ignoreContains.ForEach(ic => ignore = ignore || word.Contains(ic, StringComparison.OrdinalIgnoreCase));
                    if (!ignore)
                        searchTokens.Add(word);
                }
            }

            return searchTokens.ToList();
        }

        public static string GetTag(string tag, string txt) {

            var start = txt.IndexOf(tag);
            if (start < 0) return null;

            start += tag.Length;

            var end = txt.IndexOf('@', start);
            if (end == -1)
                end =  txt.Length;

            var rv = txt.Substring(start, end - start);

            return rv?.Trim();
        }

        private static HashSet<string> blackTokens = new HashSet<string>
        {
            "the",
            "and",
            "its",
            "has"
        };

        private static List<string> ignoreContains = new List<string>
        {
            "--",
            "[",
            "]",
            "|",
            "#",
            "7",
            "/"
        };
    }


    public class SongSummary
    {
        public string Title { get; set; }
        public string Artist { get; set; }
        public string File { get; set; }
        public List<string> SearchTokens { get; set; }
        public string Bpm { get; set; }
        public string Note { get; set; }
    };


    class TagTester
    {
        public static void Test(string[] args)
        {
            var txt = "@title Title @artist art @bpm 89---";
            Go(txt);
            
            Go(txt2);
            return;

        }

        private static void Go(string txt)
        {
            Hoo("@title", txt);
            Hoo("@artist", txt);
            Hoo("@bpm", txt);
        }
        private static void Hoo(string tag, string txt)
        {
            var rv = Controllers.SongsController.GetTag(tag, txt);
            Console.WriteLine($"{tag}--{rv}--");
        }

        private const string txt2 = @"@bpm    99
 
 @artist  Frank@bpm72
 
 @title hey
 ---
 ";
    }
}

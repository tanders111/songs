using System.Numerics;
using System.Security.Cryptography.X509Certificates;
using System.Buffers;
using System.Data;
using System.Diagnostics;
using System.Net.Sockets;
using System.Threading;
using System.Runtime.Serialization;
using System.IO;
using System.Runtime.CompilerServices;
using System.Net.Mail;
using System.Net;
using System.ComponentModel;
using System.Globalization;
using System.Net.Mime;
using System;
using System.Text;
using System.Text.RegularExpressions;
using io = System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace Songs.Web.Controllers
{
    [ApiController]
    public class WordController : ControllerBase
    {
        private string Home { get; set; }

        private static string[] _words;

        private readonly ILogger<SongsController> _logger;
        private IWebHostEnvironment hostingEnvironment;
        public WordController(ILogger<SongsController> logger, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            this.hostingEnvironment = hostingEnvironment;
            var root = hostingEnvironment.ContentRootPath;

            var localDevPath = io.Path.Combine(root, "Songs.Web");
            if (io.Directory.Exists(localDevPath))
            {
                root = localDevPath;
            }
            Home = $"{root}/words";
        }

        [HttpPost]
        [Route("app/word")]
        public IActionResult GetPotential([FromBody] StatusModel statusModel)
        {

            if (statusModel?.WrongPlace == null)
                return BadRequest(new { error = "missing WrongPlace" });

            if (statusModel?.WrongPlace.Count < 5)
                return BadRequest(new { error = $"WrongPlace only has {statusModel.WrongPlace.Count}" });

            var status = new Status
            {
                Correct = (statusModel.Correct.PadRight(5, '-')).ToLower(),
                HasNot = (statusModel.HasNot ?? "").ToLower(),
                WrongPlace = new Dictionary<int, string>()
            };


            var mrp = statusModel.WrongPlace;

            for (int i = 0; i < 5; i++)
            {
                status.WrongPlace[i] = (statusModel.WrongPlace[i] ?? "").ToLower();
            }

            var fn = $"{Home}/usa5.txt";
            if (!io.File.Exists(fn))
            {
                return UnprocessableEntity(new { error = $"{fn} not found" });
            }

            _words = _words ?? io.File.ReadAllLines(fn);

            var words = Go(status, _words);

            return Ok(words);
        }

        private List<string> Go(Status status, string[] words)
        {
            var potential = GetPotential(status, words);

            var take = potential.Take(200).ToList();

            take.ForEach(t => Console.WriteLine(t));

            var bestGuess =
            //Test(status, potential)
            //new LetterAccum(status, potential).GetBestGuess()
            new PositionAccum(status, potential).GetBestGuess()
            ;
            ;
            take.Insert(0, '*'+ bestGuess);
            Console.WriteLine($"done!   found {take.Count()} words.  Best guess is {bestGuess}");

            return take;
        }

        private List<string> GetPotential(Status status, string[] words)
        {
            var potential = words.Where(word =>
            {
                var chars = word.ToArray();
                var correct = status.Correct;
                var wrongPlace = status.WrongPlace;
                var hasNot = status.HasNot.toHashSet();

                if (chars.Any(c => hasNot.Contains(c)))
                    return false;


                for (int i = 0; i < correct.Length; i++)
                {
                    if (Char.IsLetter(correct[i]) && correct[i] != chars[i])
                        return false;
                }

                var containsAll = true;

                //todo handle more than one of same character in wrongPlace
                foreach (var kv in wrongPlace)
                {
                    var idx = kv.Key;
                    var allValuesAreInWord = !kv.Value.Any(v => !chars.Contains(v));
                    var noValuesInKnownWrongPlace = !kv.Value.Any(c => c == chars[idx]);

                    containsAll = containsAll && allValuesAreInWord && noValuesInKnownWrongPlace;
                }

                return containsAll;

            }).ToList();

            return potential;
        }

       

    }

    public class Charmap : Dictionary<char, int> { }

    public class PositionAccum
    {
        private List<Charmap> _maps = new List<Charmap>();

        private Status _status;
        private IEnumerable<string> _potential;

        public PositionAccum(Status status, IEnumerable<string> potential)
        {
            _status = status;
            _potential = potential;

            foreach (var word in potential)
            {
                var idx = 0;
                word.ToCharArray().ToList().ForEach(c =>
                {
                    _maps.Insert(idx, _maps.FirstOrDefault() ?? new Charmap());
                    var map = _maps[idx];
                    idx++;

                    if (_status.HasNot.Contains(c)) { }
                    else if (_status.WrongPlace.Values.Any(s => s.Contains(c))) { }
                    else if (_status.Correct.Contains(c)) { }
                    else
                    {
                        var v = 0;
                        if (!map.TryGetValue(c, out v))
                            map.Add(c, 1);
                        else
                            map[c] = v + 1;
                    }

                });
            }

        }

        public string GetBestGuess()
        {
            int max = 0;
            string guess = null;
            
            foreach (var word in _potential)
            {
                var total = 0;
                var idx = 0;
                var used = new HashSet<char>();
                foreach (var c in word.ToCharArray())
                {
                    var map = _maps[idx];
                    if (map.TryGetValue(c, out int v))
                    {
                        if (!used.Contains(c))
                        {
                            total += v;
                            used.Add(c);
                        }
                    }
                }

                if (total > max)
                {
                    max = total;
                    guess = word;
                    Console.WriteLine($"new guess is {word} {total}");
                }
                Console.WriteLine($"total {word} {total}");
            }
            return guess;
        }
    }

    public class LetterAccum
    {
        private Dictionary<char, int> _map = new Dictionary<char, int>();
        private Status _status;
        private IEnumerable<string> _potential;

        public LetterAccum(Status status, IEnumerable<string> potential)
        {
            _status = status;
            _potential = potential;

            foreach (var word in potential)
            {
                word.ToCharArray().ToList().ForEach(c =>
                {
                    if (_status.HasNot.Contains(c))  {}
                    else if (_status.WrongPlace.Values.Any(s => s.Contains(c))) { }
                    else if (_status.Correct.Contains(c)) { }
                    else
                    {
                        var v = 0;
                        if (!_map.TryGetValue(c, out v))
                            _map.Add(c, 1);
                        else
                            _map[c] = v + 1;
                    }

                });
            }

        }

        public string GetBestGuess()
        {
            int max = 0;
            string guess = null;
            foreach (var word in _potential)
            {
                var total = 0;
                foreach (var c in word.ToCharArray())
                {
                    if (_map.TryGetValue(c, out int v))
                    {
                        total += v;
                    }
                }

                if (total > max)
                {
                    max = total;
                    guess = word;
                    Console.WriteLine($"new guess is {word} {total}");
                }
            }
            return guess;
        }
    }

    public class Status
    {
        public string HasNot { get; set; }
        public string Correct { get; set; }
        public Dictionary<int, string> WrongPlace { get; set; }
    }

    public class StatusModel
    {
        public string HasNot { get; set; }
        public string Correct { get; set; }
        public List<string> WrongPlace { get; set; }
    }

    public static class StringExt
    {
        public static HashSet<char> toHashSet(this string s) => new HashSet<char>(s.ToArray());
    }
}

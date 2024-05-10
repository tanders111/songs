using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace Songs.Web.Controllers;

public class Anagrams
{
    public static List<string> Get(string[] lines, string letters)
    {
        var matches = lines.Where(l =>
        {
            l = l.Trim(); //if (l != "loot") return false;
            if (l.Length != letters.Length)
                return false;
            var c1 = l.ToCharArray();
            var c2 = letters.ToLower().ToCharArray();
            Array.Sort(c1);
            Array.Sort(c2);
            var rv = new string(c1) == new string(c2);
            return rv;
        })
        .ToList();

        return matches;
    }

    public static List<string> Bee(string[] lines, string availableLetters, char requiredLetter, int min)
    {
        var matches = lines.Where(l =>
        {
            l = l.ToUpper();
            if (!l.Contains(requiredLetter))
                return false;
            else if (l.Length < min)
                return false;

            l = l.Trim(); //if (l != "loot") return false;
            var wordChars = l.ToCharArray();
            var rv = !wordChars.Any(c => !availableLetters.Contains(c));
            return rv;
        })
        .OrderBy(w => w)
        .ToList()        ;
    
        return matches;
    }
}
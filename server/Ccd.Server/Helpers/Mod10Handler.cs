namespace Ccd.Server.Helpers;

public class Mod10Handler
{
    private static string getMod10Digit(string number)
    {
        var sum = 0;
        var alt = true;
        var digits = number.ToCharArray();
        for (var i = digits.Length - 1; i >= 0; i--)
        {
            var curDigit = (digits[i] - 48);
            if (alt)
            {
                curDigit *= 2;
                if (curDigit > 9)
                    curDigit -= 9;
            }

            sum += curDigit;
            alt = !alt;
        }

        return (sum % 10) == 0 ? "0" : (10 - (sum % 10)).ToString();
    }

    public static string AddMod10Digit(string number)
    {
        return number + getMod10Digit(number);
    }
}

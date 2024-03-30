namespace Ccd.Server.Helpers;

public class PatchRequest
{
    //this works like a mapper
    public Tdst Patch<Tdst>(Tdst dest)
    {
        var destType = dest.GetType();
        var patchType = this.GetType();
        var patchProperties = patchType.GetProperties();

        foreach (var property in patchProperties)
        {
            var patchValue = property.GetValue(this);
            if (patchValue != null)
            {
                var destProperty = destType.GetProperty(property.Name);
                destProperty?.SetValue(dest, patchValue);
            }
        }

        return dest;
    }
}

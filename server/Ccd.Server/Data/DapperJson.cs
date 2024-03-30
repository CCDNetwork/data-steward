using System;
using System.Data;
using Dapper;
using Npgsql;
using NpgsqlTypes;
using Ccd.Server.Helpers;

namespace Ccd.Server.Data;

public class JsonHandler<T> : SqlMapper.TypeHandler<T>
{
    public override T Parse(object value)
    {
        if (value == null || value == DBNull.Value)
        {
            return default(T);
        }

        return Json.Deserialize<T>((string)value);
    }

    public override void SetValue(IDbDataParameter parameter, T value)
    {
        if (value == null)
        {
            parameter.Value = DBNull.Value;
        }
        else
        {
            ((NpgsqlParameter)parameter).NpgsqlDbType = NpgsqlDbType.Jsonb;
            parameter.Value = Json.Serialize(value);
        }
    }
}

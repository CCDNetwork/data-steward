FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
RUN mkdir /app
WORKDIR /app
ADD . .
EXPOSE 5000
ENTRYPOINT [ "dotnet", "Ccd.Server.dll", "--urls", "http://0.0.0.0:5000" ]

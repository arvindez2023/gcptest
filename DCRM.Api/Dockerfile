#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Build App
COPY . .
RUN dotnet restore "../DCRM.Api.sln" --ignore-failed-sources
RUN dotnet build "../DCRM.Api.sln" -c Release -o /app/build

#Publish App
FROM build AS publish
RUN dotnet publish "../DCRM.Api.sln" -c Release -o /app/publish

#Copy App files
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DCRM.Api.dll"]
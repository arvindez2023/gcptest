#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DCRM.Api/DCRM.Api.csproj", "DCRM.Api/"]
COPY ["DCRM.Common/DCRM.Common.csproj", "DCRM.Common/"]
COPY ["DCRM.Service/DCRM.Service.csproj", "DCRM.Service/"]
COPY ["DCRM.Repository/DCRM.Repository.csproj", "DCRM.Repository/"]
RUN dotnet restore "DCRM.Api/DCRM.Api.csproj"
COPY . .
WORKDIR "/src/DCRM.Api"
RUN dotnet build "DCRM.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DCRM.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DCRM.Api.dll"]
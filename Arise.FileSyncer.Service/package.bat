@echo off

:: Restore packages in interactive mode
call dotnet restore -r win-x64 --interactive
call dotnet restore -r win-x86 --interactive
call dotnet restore -r linux-x64 --interactive

:: Build the self-contained packages
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/win-x64/ --self-contained -r win-x64
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/win-x86/ --self-contained -r win-x86
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/linux-x64/ --self-contained -r linux-x64

pause
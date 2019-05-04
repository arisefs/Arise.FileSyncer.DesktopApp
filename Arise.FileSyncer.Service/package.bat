@echo off

if exist "bin\Publish" (
    rd /s /q "bin\Publish"
)

:: Build the self-contained packages
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/win-x64/ --self-contained -r win-x64 || PAUSE
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/win-x86/ --self-contained -r win-x86 || PAUSE
call dotnet publish -c Release -f netcoreapp3.0 -o ./bin/Publish/linux-x64/ --self-contained -r linux-x64 || PAUSE
@echo off

if exist "bin\Publish" (
    rd /s /q "bin\Publish"
)

:: Build the self-contained packages
call dotnet publish -c Release -o ./bin/Publish/win-x64/ --self-contained -r win-x64 -p:PublishReadyToRun=true
call dotnet publish -c Release -o ./bin/Publish/win-x86/ --self-contained -r win-x86 -p:PublishReadyToRun=true
call dotnet publish -c Release -o ./bin/Publish/linux-x64/ --self-contained -r linux-x64
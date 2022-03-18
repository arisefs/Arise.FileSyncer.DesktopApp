@echo off

:: Clean-up
if exist "bin\Publish" (
    rd /s /q "bin\Publish"
)

call dotnet clean

:: Build the self-contained packages
call dotnet publish -c Release --output ./bin/Publish/win-x64/ --runtime win-x64 --self-contained
call dotnet publish -c Release --output ./bin/Publish/linux-x64/ --runtime linux-x64 --self-contained
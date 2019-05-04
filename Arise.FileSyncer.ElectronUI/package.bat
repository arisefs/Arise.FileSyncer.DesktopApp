@echo off

:: Remove existing files to have a clean build
if exist "dist\" (
    echo Cleaning "dest" directory...
    rd /s /q "dist"
)

:: Build code with webpack in production mode
echo Building production code...
call npm run build-prod

:: Copy package.json
copy /Y src\package.json dist\package.json

:: Package app for all platforms
echo Packaging application for all platforms...
call npm run package:win32
call npm run package:win64
call npm run package:linux

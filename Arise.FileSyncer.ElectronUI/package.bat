@echo off

:: Remove existing final builds
if exist "bin\" (
    echo Cleaning "bin" directory...
    rd /s /q "bin"
)

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

:: Rename package directories
echo Renaming directories to the correct format...
ren bin\afs-manager-win32-ia32 win-x86
ren bin\afs-manager-win32-x64 win-x64
ren bin\afs-manager-linux-x64 linux-x64
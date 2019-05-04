@echo off

:: Remove existing final builds
if exist "bin\" (
    rd /s /q "bin"
)

:: Remove existing files to have a clean build
if exist "dist\" (
    rd /s /q "dist"
)

:: Build code with webpack in production mode
echo Building production code...
call npm run build-prod || PAUSE

:: Copy package.json
copy /Y src\package.json dist\package.json

:: Package app for all platforms
echo Packaging application for all platforms...
call npm run package:win32 || PAUSE
call npm run package:win64 || PAUSE
call npm run package:linux || PAUSE

:: Rename package directories
echo Renaming directories to the correct format...
ren bin\afs-manager-win32-ia32 win-x86
ren bin\afs-manager-win32-x64 win-x64
ren bin\afs-manager-linux-x64 linux-x64
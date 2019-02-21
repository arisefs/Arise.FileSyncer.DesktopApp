@echo off

:: Remove existing files to have a clean build
IF EXIST "dist\" (
RD /S /Q "dist"
)

:: Build code with webpack in production mode
call npm run build-prod

:: Copy package.json
COPY /Y src\package.json dist\package.json

:: Package app for all platforms
call npm run package:win32
call npm run package:win64
call npm run package:linux

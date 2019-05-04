@echo off

set diroutput=Packages

if exist %diroutput% (
    rd /s /q %diroutput%
)

:: Run the 2 projects packagers
cd Arise.FileSyncer.ElectronUI
call package.bat
cd ../Arise.FileSyncer.Service
call package.bat
cd ..

:: Package them in a zip with the correct naming
call :ZipPackages manager Arise.FileSyncer.ElectronUI/bin
call :ZipPackages service Arise.FileSyncer.Service/bin/Publish

exit

:ZipPackages
for /d %%X in (%~2/*) do (
    call "C:\Program Files\7-Zip\7z.exe" a -tzip "%diroutput%/%~1-%%X.zip" "./%~2/%%X/*" || PAUSE
)
exit /b
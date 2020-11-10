@echo off

set diroutput=Packages

if exist %diroutput% (
    rd /s /q %diroutput%
)
mkdir %diroutput%

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
    pwsh.exe -noprofile -command "Compress-Archive -Path ./%~2/%%X/* -CompressionLevel Optimal -DestinationPath %diroutput%/%~1-%%X"
)
exit /b
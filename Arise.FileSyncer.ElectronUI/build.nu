alias step = cprint cyan

if not ('package.json' | path exists) {
    cprint red 'Incorrect working directory'
    exit 1
}

step 'Cleaning up...'
rm -prf 'bin'
rm -prf 'dist'

step 'Installing node packages...'
^npm install

step 'Building production code...'
^npm run build-prod
cp 'src/package.json' 'dist/package.json'

step 'Packaging application for all platforms...'
^npm run package:win64
^npm run package:linux

step 'Renaming directories to the correct format...'
mv 'bin/afs-manager-win32-x64' 'bin/win-x64'
mv 'bin/afs-manager-linux-x64' 'bin/linux-x64'

step 'Done!'


def cprint [color text] {
    echo [(ansi $color) $text (ansi reset)] | str collect
}

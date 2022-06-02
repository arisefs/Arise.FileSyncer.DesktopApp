alias check = if $env.LAST_EXIT_CODE != 0 { exit 1 }

if not ('package.json' | path exists) {
    echo [(ansi red) 'Incorrect working directory' (ansi reset)] | str collect
    exit 1
}

step 'Cleaning up...'
rm -prf 'bin'
rm -prf 'dist'

step 'Installing node packages...'
^npm install; check

step 'Building production code...'
^npm run build-prod; check
cp 'src/package.json' 'dist/package.json'

step 'Packaging application for all platforms...'
^npm run package:win64; check
^npm run package:linux; check

step 'Renaming directories to the correct format...'
mv 'bin/afs-manager-win32-x64' 'bin/win-x64'
mv 'bin/afs-manager-linux-x64' 'bin/linux-x64'

step 'Done!'


def step [text] {
    echo [(ansi cyan) $text (ansi reset)] | str collect
}

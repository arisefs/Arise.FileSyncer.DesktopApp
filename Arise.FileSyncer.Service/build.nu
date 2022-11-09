alias step = cprint cyan

if not ('Arise.FileSyncer.Service.csproj' | path exists) {
    cprint red 'Incorrect working directory'
    exit 1
}

step 'Cleaning up...'
rm -prf 'bin/Publish'

step 'Building .Net project for all platforms (that it can)...'
let platforms = ['win10-x64' 'linux-x64']
for platform in $platforms {
    step $'Building ($platform)'
    build $platform
}

step 'Done!'


def cprint [color text] {
    echo [(ansi $color) $text (ansi reset)] | str collect
}

def build [rt] {
    ^dotnet publish -o $'bin/Publish/($rt)' -r $rt
}

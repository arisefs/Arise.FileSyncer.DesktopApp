alias check = if $env.LAST_EXIT_CODE != 0 { exit 1 }

if not ('Arise.FileSyncer.Service.csproj' | path exists) {
    echo [(ansi red) 'Incorrect working directory' (ansi reset)] | str collect
    exit 1
}

step 'Cleaning up...'
rm -prf 'bin/Publish'

step 'Building .Net project for all platforms...'
let platforms = ['win-x64' 'linux-x64']
for platform in $platforms {
    step $'Building ($platform)'
    build $platform
}

step 'Done!'


def step [text] {
    echo [(ansi cyan) $text (ansi reset)] | str collect
}

def build [rt] {
    ^dotnet publish -c Release -o $'bin/Publish/($rt)' -r $rt --sc
    check
}

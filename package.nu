alias check = if $env.LAST_EXIT_CODE != 0 { exit 1 }

let projects = [
    [name pkgs type]; 
    ['Arise.FileSyncer.Service' 'bin/Publish' 'service']
    ['Arise.FileSyncer.ElectronUI' 'bin' 'manager']
]

step 'Creating release packages'
step 'Cleaning up...'
let out = do { 'Packages' | path expand }
rm -prf $out; mkdir $out

for pr in $projects {
    step $'Packaging ($pr.name)'
    cd $pr.name
    ^nu 'build.nu'; check
    cd $pr.pkgs
    ls | each { |i| compress $'($pr.type)-($i.name)' $i.name }
    ignore
}

step 'Success!'


def step [text] {
    echo [(ansi purple) $text (ansi reset)] | str collect
}

def compress [name, dir] {
    let archive = $'($out)/($name).zip'
    cd $dir
    if ((which '7z' | length) == 0) {
        ^7zz a $archive *
    } else {
        ^7z a $archive *
    }
    check
}

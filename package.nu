alias step = cprint purple

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
    ^nu 'build.nu'
    cd $pr.pkgs
    ls | each { |i| compress $'($pr.type)-($i.name)' $i.name }
    ignore
}

step 'Success!'


def cprint [color text] {
    echo [(ansi $color) $text (ansi reset)] | str collect
}

def compress [name, dir] {
    let archive = $'($out)/($name).zip'
    cd $dir
    # Use 7zz if available (the official up-to-date version of 7zip on Linux)
    if ((which '7zz' | length) == 0) {
        ^7z a $archive *
    } else {
        ^7zz a $archive *
    }
}

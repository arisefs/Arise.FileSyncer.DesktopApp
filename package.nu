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
    if ((which '7z' | length) == 0) { alias 7z = ^7zz } else { alias 7z = ^7z }
    cd $dir; 7z a $'($out)/($name).zip' *; check
}

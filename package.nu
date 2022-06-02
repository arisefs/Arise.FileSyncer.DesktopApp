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
    ls | each { |i| compress $i.name $'($out)/($pr.type)-($i.name)' }
    ignore
}

step 'Success!'


def step [text] {
    echo [(ansi purple) $text (ansi reset)] | str collect
}

def compress [dir, target] {
    ^pwsh -nop -c $'Compress-Archive -Path ($dir)/* -DestinationPath ($target) -CompressionLevel Optimal'
    check
}

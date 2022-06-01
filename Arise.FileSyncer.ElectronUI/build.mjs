import fs from "fs"
import os from "os"
import cp from "child_process"
import { exit } from "process";

const NPM = npmExec();

logStep('Cleaning up...')
rmIfExists('./bin')
rmIfExists('./dist')

logStep('Installing node packages...')
spawn(NPM, ['install'])

logStep('Building production code...')
spawn(NPM, ['run', 'build-prod'])
fs.copyFileSync('./src/package.json', './dist/package.json')

logStep('Packaging application for all platforms...')
spawn(NPM, ['run', 'package:win64'])
spawn(NPM, ['run', 'package:linux'])

logStep('Renaming directories to the correct format...')
fs.renameSync('./bin/afs-manager-win32-x64', './bin/win-x64')
fs.renameSync('./bin/afs-manager-linux-x64', './bin/linux-x64')

logStep('Done!')

// Functions
function rmIfExists(path) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true })
    }
}

function npmExec() {
    return (os.platform() == 'win32') ? 'npm.cmd' : 'npm';
}

function spawn(file, args) {
    const result = cp.spawnSync(file, args, { stdio: 'inherit', encoding: 'utf8' })
    if (result.status != 0) {
        console.error(result.stderr)
        exit(1)
    }
}

function logStep(message) {
    const Reset = "\x1b[0m"
    const FgCyan = "\x1b[36m"
    console.log(FgCyan + message + Reset);
}

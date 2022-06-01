local function isunix()
    return package.config:sub(1, 1) == '/'
end

local function tonull()
    if isunix() then
        return '> /dev/null 2>&1'
    else
        return '>nul 2>nul'
    end
end

local function removedir(path)
    if isunix() then
        os.execute('rm -rd "' .. path .. '" ' .. tonull())
    else
        os.execute('rd /s/q "' .. path .. '" ' .. tonull())
    end
end

local function printstep(text)
    print('\27[36m' .. text .. '\27[0m')
end

local function cexec(cmd)
    if os.execute(cmd) ~= true then
        os.exit(false)
    end
end

local function copy(src, dest)
    if isunix() then
        os.execute('cp "' .. src .. '" "' .. dest .. '" ' .. tonull())
    else
        os.execute('copy /Y "' .. src .. '" "' .. dest .. '" ' .. tonull())
    end
end

printstep('Cleaning up...')
removedir('bin')
removedir('dist')

printstep('Installing node packages...')
cexec('npm install')

printstep('Building production code...')
cexec('npm run build-prod')
copy('src/package.json', 'dist/package.json')

printstep('Packaging application for all platforms...')
cexec('npm run package:win64')
cexec('npm run package:linux')

printstep('Renaming directories to the correct format...')
os.rename('bin/afs-manager-win32-x64', 'bin/win-x64')
os.rename('bin/afs-manager-linux-x64', 'bin/linux-x64')

printstep('Done!')

const { readFileSync, writeFileSync } = require("fs")
const { execSync } = require("node:child_process")

const packages = [
    {
        named: `react-performance-context`
    },
    {
        named: `create-object-context`
    },
    {
        named: `use-object-context`
    }
]

execSync(`npm run build`)
let packageJson = readFileSync(`package.json`, `utf-8`)

for (const { named } of packages) {
    packageJson = packageJson.replace(/"name":.+,/, `"name": "${named}",`)
    writeFileSync(`package.json`, packageJson, `utf-8`)
    execSync(`npm publish`)
}

packageJson = packageJson.replace(/"name":.+,/, `"name": "${packages[0].named}",`)
writeFileSync(`package.json`, packageJson, `utf-8`)
const { readFileSync } = require("fs")
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

for (const { named } of packages) {
    execSync(`cd build/`)
    const packageJson = readFileSync(`package.json`, `utf-8`)
    packageJson.replace(/"name":.+,/, `"name": "${named}",`)
    writeFileSync(`package.json`, packageJson, `utf-8`)
    execSync(`npm publish && cd ../`)
}
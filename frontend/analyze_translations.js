const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');
let withT = 0;
let total = files.length;
let counts = {};
let missingTranslation = [];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.match(/t\(['"](.*?)['"]/g);
    if(matches) {
        withT++;
        counts[f] = matches.length;
    } else {
        counts[f] = 0;
    }

    // Rough check for hardcoded text in JSX
    // Looks for >Text< patterns
    const hardcodedMatches = content.match(/>[ \n\t]*([A-Z][A-Za-z0-9_ \-éèàçêâîôû]+)[ \n\t]*<\//g);
    if(hardcodedMatches && hardcodedMatches.length > 5) {
        missingTranslation.push({ file: f, count: hardcodedMatches.length });
    }
});

console.log('Total files:', total);
console.log('Files with t():', withT);
console.log('Top files with potential hardcoded text:');
missingTranslation.sort((a,b)=>b.count - a.count).slice(0, 15).forEach(m => console.log(m.file, m.count));

import {mkdir,copyFile} from 'node:fs/promises';
const files=['index.html','style.css','app.js','content.js','profile.js','icon.svg'];
await mkdir('dist',{recursive:true});
for(const file of files) await copyFile(file,`dist/${file}`);
console.log('Build ready: dist/');

import test from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../content.js';
import {safeURL,escapeHTML} from '../app.js';
import {profile} from '../profile.js';
test('All languages provide every interface key and content item',()=>{
 const keys=Object.keys(content.uz).sort();
 for(const lang of ['uz','ru','en']){
  assert.deepEqual(Object.keys(content[lang]).sort(),keys);
  for(const [key,value] of Object.entries(content[lang])){assert.ok(value.length>0,key);if(Array.isArray(value))assert.equal(value.length,content.uz[key].length,key);}
  assert.equal(content[lang].nav.length,5);
  assert.equal(content[lang].projects.length,3);
  assert.equal(content[lang].articles.length,3);
 }
});
test('Public links reject executable and unexpected protocols',()=>{
 for(const input of ['javascript:alert(1)','data:text/html,x','http://example.com','file:///secret','not a URL',''])assert.equal(safeURL(input),null);
 assert.equal(safeURL('https://example.com/demo'),'https://example.com/demo');
});
test('Profile text is escaped before rendering',()=>{
 assert.equal(escapeHTML('<img src=x onerror="alert(1)">&\''),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');
});
test('Personal data starts private and unspecified',()=>{
 assert.equal(profile.location.visible,false);
 assert.equal(profile.email,'');
 assert.ok(Object.values(profile.socials).every(v=>v===''));
});

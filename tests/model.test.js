import test from 'node:test';
import assert from 'node:assert/strict';
import { createVessel, interpretPrompt, triangleCount } from '../src/model.js';
test('prompt routing supports material directions and honest unknown fallback',()=>{
 assert.equal(interpretPrompt('A silver metal vase').key,'chrome');
 assert.equal(interpretPrompt('warm clay vessel').key,'terracotta');
 assert.equal(interpretPrompt('green ceramic vase').key,'organic');
 assert.equal(interpretPrompt('spaceship').supported,false);
});
test('detail increases mesh resolution and all coordinates stay finite',()=>{
 for(const shape of ['organic','round','twist']){
 const low=createVessel({detail:16,shape}),high=createVessel({detail:96,shape});
 assert.ok(triangleCount(high)>triangleCount(low));
 assert.ok([...high.attributes.position.array].every(Number.isFinite));
 low.dispose();high.dispose();
 }
});
test('cleanup comparison changes surface without changing topology',()=>{
 const clean=createVessel({detail:40}),noisy=createVessel({detail:40,noisy:true});
 assert.equal(clean.attributes.position.count,noisy.attributes.position.count);
 assert.notDeepEqual(clean.attributes.position.array,noisy.attributes.position.array);
 clean.dispose();noisy.dispose();
});

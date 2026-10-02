const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');global.turf=require(path.join(root,'docs/vendor/turf.min.js'));require(path.join(root,'docs/analysis.js'));
for(const [file,id,minBuildings] of [['campus','relation/5608085',1200],['coict','way/478260661',20]]){
 const data=JSON.parse(fs.readFileSync(path.join(root,'docs/data/'+file+'.json'),'utf8'));
 assert.equal(data.boundary.features[0].properties.id,id);assert(data.buildings.features.length>=minBuildings);
 for(const k of ['buildings','roads','amenities'])assert.equal(new Set(data[k].features.map(f=>f.properties.id)).size,data[k].features.length,'Duplicate OSM objects');
 const full=CampusAnalysis.validateFlood(data.boundary);const overlap=CampusAnalysis.analyze(data,full);
 assert.equal(overlap.buildings.size,data.buildings.features.length);assert.equal(overlap.amenities.size,data.amenities.features.length);
 const repeated=CampusAnalysis.analyze(data,{type:'FeatureCollection',features:[...full.features,...full.features]});assert.equal(repeated.buildings.size,overlap.buildings.size,'Repeated flood polygons counted twice');
 const disjoint=CampusAnalysis.validateFlood(turf.polygon([[[30,-8],[30.01,-8],[30.01,-7.99],[30,-7.99],[30,-8]]]));assert.equal(CampusAnalysis.analyze(data,disjoint).buildings.size,0);
 console.log(file+': boundary, object IDs and exposure checks passed');
}
assert.throws(()=>CampusAnalysis.validateFlood(turf.point([39,-6])));assert.throws(()=>CampusAnalysis.validateFlood({type:'FeatureCollection',features:[]}));assert.throws(()=>CampusAnalysis.validateFlood({type:'Polygon',coordinates:[[[39,-6],[40,-6],[40,-7],[39,-7]]]}));
for(const name of ['docs/index.html','docs/coict/index.html']){const page=path.join(root,name),s=fs.readFileSync(page,'utf8');for(const m of s.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1];if(/^(https?:|data:)/.test(ref))continue;assert(fs.existsSync(path.resolve(path.dirname(page),ref)),name+' missing '+ref);}}
const coict=fs.readFileSync(path.join(root,'docs/coict/index.html'),'utf8');assert(!coict.includes('relation/5608085'),'CoICT page references main boundary');assert(coict.includes('way/478260661'));console.log('Both pages: local assets and campus separation passed');

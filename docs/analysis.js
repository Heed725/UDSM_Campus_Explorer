/* Geometric exposure calculations. No flood scenario is fabricated. */
(function(root){
function validateFlood(raw){
 let features=raw.type==='FeatureCollection'?raw.features:raw.type==='Feature'?[raw]:[{type:'Feature',properties:{},geometry:raw}];
 if(!Array.isArray(features)||!features.length)throw Error('The file has no polygon features.');
 if(features.length>2000)throw Error('Use a flood layer with at most 2,000 polygons.');
 let count=0;
 const out=features.map((f,i)=>{
  const g=f.geometry;if(!g||!['Polygon','MultiPolygon'].includes(g.type))throw Error('Every feature must be a Polygon or MultiPolygon. Export a polygon-only layer from QGIS.');
  const polygons=g.type==='Polygon'?[g.coordinates]:g.coordinates;
  if(!Array.isArray(polygons)||!polygons.length)throw Error('A polygon is empty.');
  for(const poly of polygons){if(!Array.isArray(poly)||!poly.length)throw Error('A polygon has no rings.');for(const ring of poly){
   if(!Array.isArray(ring)||ring.length<4)throw Error('Polygon rings need at least four coordinates.');
   for(const p of ring){count++;if(count>150000)throw Error('Simplify the flood layer to fewer than 150,000 vertices.');if(!Array.isArray(p)||p.length<2||!Number.isFinite(p[0])||!Number.isFinite(p[1])||Math.abs(p[0])>180||Math.abs(p[1])>90)throw Error('Use longitude/latitude coordinates in WGS 84 (EPSG:4326).');}
   if(ring[0][0]!==ring.at(-1)[0]||ring[0][1]!==ring.at(-1)[1])throw Error('A polygon ring is not closed. Repair the geometry in QGIS.');
  }}
  const clean={type:'Feature',properties:{id:i},geometry:g};if(!turf.booleanValid(clean))throw Error('A polygon has invalid geometry. Run Fix Geometries in QGIS first.');return clean;
 });return {type:'FeatureCollection',features:out};
}
function analyze(data,flood){
 const ids={buildings:new Set(),amenities:new Set()};
 for(const kind of Object.keys(ids))for(const feature of data[kind].features){const hit=flood.features.some(f=>kind==='buildings'?turf.booleanIntersects(feature,f):turf.booleanPointInPolygon(feature,f));if(hit)ids[kind].add(feature.properties.id);}
 return ids;
}
root.CampusAnalysis={validateFlood,analyze};
})(typeof window!=='undefined'?window:globalThis);

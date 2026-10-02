'use strict';
(function(root){
 const groups=Object.freeze([
  {id:'education',label:'Education & research',color:'#1763a6',types:['college','university','school','library','coworking_space']},
  {id:'food',label:'Food & drink',color:'#b55b12',types:['cafe','restaurant','fast_food','food_court','bar','pub','ice_cream']},
  {id:'finance',label:'Banking & money',color:'#7953a4',types:['bank','atm','bureau_de_change','money_transfer']},
  {id:'health',label:'Health & veterinary',color:'#b94054',types:['clinic','hospital','pharmacy','doctors','dentist','veterinary']},
  {id:'transport',label:'Transport & parking',color:'#536477',types:['parking','parking_space','parking_entrance','bus_station','fuel','taxi','bicycle_parking','bicycle_rental','car_rental','charging_station']},
  {id:'community',label:'Community, worship & leisure',color:'#16796c',types:['community_centre','place_of_worship','grave_yard','cinema','theatre','arts_centre','social_centre']},
  {id:'housing',label:'Student housing',color:'#94652c',types:['student_accommodation']},
  {id:'administration',label:'Administration & security',color:'#354f89',types:['office','police','townhall','courthouse','fire_station']},
  {id:'sanitation',label:'Water & sanitation',color:'#617a22',types:['toilets','drinking_water','water_point','waste_disposal','waste_basket','recycling','shower']},
  {id:'other',label:'Other amenities',color:'#777777',types:[]}
 ].map(g=>Object.freeze({...g,types:Object.freeze(g.types)})));
 const byType=new Map(groups.flatMap(g=>g.types.map(t=>[t,g])));
 function group(feature){return byType.get(feature.properties.category)||groups[groups.length-1];}
 function matches(feature,id){return feature.properties.kind!=='amenities'||id==='all'||group(feature).id===id;}
 function counts(features){return groups.map(g=>({...g,count:features.filter(f=>group(f).id===g.id).length})).filter(g=>g.count>0);}
 root.AmenityCategories=Object.freeze({groups,group,matches,counts});
})(typeof window==='undefined'?globalThis:window);

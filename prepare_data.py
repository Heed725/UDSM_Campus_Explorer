"""Build the bundled OSM snapshot. Requires Shapely; see README."""
import argparse, gzip, json, xml.etree.ElementTree as ET
from pathlib import Path
from shapely.geometry import Point, Polygon, LineString, mapping
from shapely.ops import polygonize, unary_union
parser=argparse.ArgumentParser(description='Rebuild the bundled main-campus or CoICT OSM dataset.')
parser.add_argument('--campus',choices=['main','coict'],default='main')
args=parser.parse_args()
is_coict=args.campus=='coict'
source=Path('source-data/coict-osm.xml.gz' if is_coict else 'source-data/osm.xml.gz')
root=ET.fromstring(gzip.decompress(source.read_bytes()))
nodes={e.get('id'):[float(e.get('lon')),float(e.get('lat'))] for e in root.findall('node')}
ways={e.get('id'):e for e in root.findall('way')}
def tags(e):return {t.get('k'):t.get('v') for t in e.findall('tag')}
def coords(e):return [nodes[n.get('ref')] for n in e.findall('nd') if n.get('ref') in nodes]
if is_coict:
 boundary=Polygon(coords(ways['478260661']))
 boundary_id='way/478260661'
 boundary_name='CoICT Kijitonyama campus'
 boundary_note='Analysis uses the OpenStreetMap mapped CoICT Kijitonyama campus polygon, not a surveyed property boundary. Counts reflect mapped features only.'
else:
 boundary_relation=next(e for e in root.findall('relation') if e.get('id')=='5608085')
 boundary_lines=[]
 for member in boundary_relation.findall('member'):
  if member.get('type')=='way' and member.get('role')=='outer':
   boundary_lines.append(LineString(coords(ways[member.get('ref')])))
 boundary=unary_union(list(polygonize(unary_union(boundary_lines))))
 boundary_id='relation/5608085'
 boundary_name='Chuo Kikuu — full triangle'
 boundary_note='Analysis uses the full Chuo Kikuu administrative subward boundary in OpenStreetMap. This is the requested triangle study area, not a surveyed university ownership boundary. Counts reflect mapped features only.'
assert boundary.is_valid and not boundary.is_empty, 'Incomplete study boundary'
assert boundary.geom_type in ('Polygon','MultiPolygon')
result={'buildings':[], 'roads':[], 'amenities':[]}
handled=set()
def feature(e,geom,kind):
 t=tags(e);p={'id':e.tag+'/'+e.get('id'),'name':t.get('name') or t.get('operator') or '', 'kind':kind,'category':t.get('building' if kind=='buildings' else 'highway' if kind=='roads' else 'amenity','unknown'), 'tags':t}
 return {'type':'Feature','properties':p,'geometry':mapping(geom)}
def add(e,g):
 if not g.is_valid:g=g.buffer(0)
 if g.is_empty or not g.intersects(boundary):return
 t=tags(e)
 if t.get('building') not in (None,'no') and boundary.covers(g.representative_point()):result['buildings'].append(feature(e,g,'buildings'))
 if 'highway' in t and g.geom_type in ('LineString','MultiLineString'):
  g=g.intersection(boundary)
  if not g.is_empty and g.geom_type in ('LineString','MultiLineString'):result['roads'].append(feature(e,g,'roads'))
 if 'amenity' in t and e.tag+'/'+e.get('id')!=boundary_id and not (not is_coict and e.tag=='way' and e.get('id')=='798357475'):
  p=g if g.geom_type=='Point' else g.representative_point()
  if boundary.covers(p):result['amenities'].append(feature(e,p,'amenities'))
for e in root.findall('relation'):
 t=tags(e)
 if t.get('type')!='multipolygon' or not ('building' in t or 'amenity' in t):continue
 outer=[];inner=[];members=[]
 for m in e.findall('member'):
  if m.get('type')!='way' or m.get('ref') not in ways:continue
  c=coords(ways[m.get('ref')]);members.append(m.get('ref'))
  if len(c)>1:(inner if m.get('role')=='inner' else outer).append(LineString(c))
 polys=list(polygonize(unary_union(outer)))
 if not polys:continue
 g=unary_union(polys)
 if inner:g=g.difference(unary_union(list(polygonize(unary_union(inner)))))
 add(e,g);handled.update(members)
for e in root.findall('way'):
 if e.get('id') in handled:continue
 t=tags(e);c=coords(e)
 if len(c)<2:continue
 if 'building' in t or 'amenity' in t:
  if len(c)>=4 and c[0]==c[-1]:add(e,Polygon(c))
 elif 'highway' in t:add(e,LineString(c))
for e in root.findall('node'):
 if 'amenity' in tags(e):add(e,Point(nodes[e.get('id')]))
for k,v in result.items():print(k,len(v))
result={k:{'type':'FeatureCollection','features':v} for k,v in result.items()}
result['boundary']={'type':'FeatureCollection','features':[{'type':'Feature','properties':{'name':boundary_name,'id':boundary_id},'geometry':mapping(boundary)}]}
result['metadata']={'source':'OpenStreetMap contributors','license':'ODbL 1.0','retrieved':'2026-10-02','boundaryId':boundary_id,'boundaryName':boundary_name,'boundaryNote':boundary_note,'floodSource':None}
output=Path('docs/data/coict.json' if is_coict else 'docs/data/campus.json')
output.write_text(json.dumps(result,separators=(',',':')))
print('Written',output)

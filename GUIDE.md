# UDSM Main Campus Explorer

Independent web GIS inspired by the Tabata Ward Flood & Infrastructure Explorer.

## Using the app

1. Open **Interactive map**. The initial extent is the full triangle labelled Chuo Kikuu in OpenStreetMap (relation 5608085), including the wider main-campus surroundings.
2. Toggle Chuo Kikuu boundary, buildings, roads and paths, and amenities in **Map layers**.
3. Search a mapped place by name, type or OSM ID. Search filters infrastructure layers; clear it to restore them.
4. Choose OpenStreetMap, CARTO light or Esri satellite. Basemaps require an internet connection. The infrastructure geometry is bundled.
5. Click a building, road or amenity to inspect its source record. **Reset map view** restores layers and the campus extent.
6. Open **Dashboard** for building types, amenities, road/path length and flood exposure.
7. Open **Data table**, choose a layer, search or sort its records, and use **Locate** to inspect it on the map.
8. **Download CSV** exports every record in the current filtered table, not just the visible page. Coordinates are feature bounding-box centres, not entrances or surveyed GPS points.

## Amenity categories

Use **Amenity category** on the map or in the amenities table to select a group. Both filters stay in sync. Search works with category names as well as names, OSM types and IDs. Expand **Category legend** for colours and campus-wide counts. In the dashboard, click a category bar to show that group on the map. **Reset map view** restores all categories.

The table separates **Category** from the original **OSM type**. CSV exports include both fields and follow the current table category and search filters. Building and road tables are unaffected by the amenity category filter. Map totals, dashboard counts and flood exposure always describe the complete campus dataset; the map shows its filtered amenity count below the category selector.

| Category | Recorded OSM types in these datasets | Main campus | CoICT |
| --- | --- | ---: | ---: |
| Education & research | college, university, school, library, coworking_space | 39 | 2 |
| Food & drink | cafe, restaurant, fast_food, food_court, bar | 24 | 1 |
| Banking & money | bank, atm, bureau_de_change | 14 | 0 |
| Health & veterinary | clinic, pharmacy, veterinary | 5 | 0 |
| Transport & parking | parking, parking_space, bus_station, fuel | 24 | 1 |
| Community, worship & leisure | community_centre, place_of_worship, grave_yard, cinema | 8 | 0 |
| Student housing | student_accommodation | 1 | 0 |
| Administration & security | office, police | 10 | 0 |
| Water & sanitation | toilets, drinking_water, waste_disposal | 9 | 3 |
| **Total mapped records** | | **134** | **7** |

Classification uses the recorded `amenity` tag, not guessed names or operator ownership. Original source types and records are unchanged. Only groups with mapped records appear in the selected campus. Newly introduced types without a mapping appear under **Other amenities**. Categories have distinct map colours; flood-exposed amenities retain their category colour with a red outline. The shared mapping is in `docs/amenity-categories.js`.

## Flood extent from QGIS

No flood dataset is bundled and no initial flood exposure is claimed.

1. Load your flood-extent polygon layer in QGIS.
2. If necessary run **Fix geometries**, then **Simplify** large datasets.
3. Right-click the layer → **Export → Save Features As**.
4. Format: **GeoJSON**. CRS: **EPSG:4326 — WGS 84**. Save the file.
5. In the app choose **Load flood GeoJSON**. Files are limited to 5 MB, 2,000 polygon features and 150,000 vertices. Polygon/MultiPolygon geometry only.
6. The app counts footprints intersecting the supplied flood polygons, including boundary contact. Amenity points on or inside the polygons are counted as exposed.
7. Use **Show exposed buildings only**, or inspect the updated dashboard and CSV.
8. **Remove flood layer** restores the “Not assessed” state.

Files are read locally in the browser and are not uploaded or saved. Reloading clears a loaded flood layer. Overlapping flood polygons do not count a feature more than once. Roads are not assessed for flood exposure. Building occupancy and population-at-risk estimates are not inferred.

## Data and limitations

- OpenStreetMap snapshot retrieved 2026-10-02 through the OSM API.
- Full Chuo Kikuu study boundary: https://www.openstreetmap.org/relation/5608085
- 1,213 building footprints, 134 amenity objects, 356 road/path segments (~54.44 km), across the full ~5.057 km² Chuo Kikuu triangle.
- Building relations are assembled with their inner rings; member ways are not counted again.
- Buildings are included if their representative interior point falls within the boundary. Roads are clipped to it. Amenity polygons are represented by an interior point.
- Chuo Kikuu is an OSM administrative subward boundary, not a surveyed university property boundary. All mapped features within this requested triangle are included, irrespective of their operator. These are counts of OSM objects, not a complete official asset register. Amenity duplicates and unnamed/unmapped features may exist.
- The snapshot does not update itself. Flood exposure is geometric overlap, not flood depth, a forecast, damage or safety advice.
- Official campus context: https://udsm.ac.tz/undergraduate/student-life-campus-life
- Reference app: https://michael-army.shinyapps.io/Tabata/

## Source and running locally

The app is plain HTML/CSS/JavaScript. Serve `docs` over HTTP:

```bash
python -m http.server 8000 --directory docs
```

Open http://localhost:8000 . Do not open index.html directly; browsers restrict data loading from file URLs.

`docs/data/campus.json` is the bundled GeoJSON dataset. `source-data/osm.xml.gz` preserves the larger source extract. `source-data/chuo-kikuu-boundary.xml.gz` preserves the complete OSM relation and its member geometry; it is merged into the extract before processing. To rebuild that dataset, install Shapely and run from the project root:

```bash
python -m pip install shapely
python prepare_data.py --campus main
python prepare_data.py --campus coict
```

The extraction bounds were `39.1929,-6.7926,39.2225,-6.7656`. To respect the OSM API object limit, four map requests divide those bounds at longitude 39.2077 and latitude -6.7791; their results are deduplicated by OSM object type and ID. The full boundary geometry comes from `https://api.openstreetmap.org/api/0.6/relation/5608085/full`. If replacing the extract, preserve gzip format and verify the campus boundary and counts before rebuilding. Exposure implementation is in `docs/analysis.js`; it uses Turf 7.2.0. Mapping uses Leaflet 1.9.4. Both libraries are bundled locally. Basemap services remain external.

## Attribution

Geographic data © OpenStreetMap contributors, available under the Open Database License (ODbL 1.0): https://www.openstreetmap.org/copyright . Preserve attribution with redistributed data. Leaflet is BSD-2-Clause; Turf is MIT. Basemap attribution appears on the map. This project is independent and does not claim official UDSM affiliation.

## Separate CoICT explorer

Open `/coict/` on the published site, or `http://localhost:8000/coict/` locally. It uses only the OSM mapped CoICT campus polygon (way 478260661), at Kijitonyama. The dataset is `docs/data/coict.json`; its raw source is `source-data/coict-osm.xml.gz`. The same map, dashboard, CSV and flood-analysis controls operate on that dataset alone. Main-campus data is not loaded in the CoICT explorer. Counts are 22 mapped building footprints, seven amenity objects and eight road/path segments (~1.24 km), inside the ~7.24-hectare mapped campus. The OSM point placement and footprints may be incomplete; no unmapped buildings or flood data are invented.

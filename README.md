# UDSM Campus Explorer

Two independent interactive campus GIS explorers inspired by the Tabata Flood & Infrastructure Explorer:

| Explorer | Study area | Mapped buildings | Mapped amenities | Roads and paths |
| --- | --- | ---: | ---: | ---: |
| UDSM Main Campus | Full Chuo Kikuu triangle, OSM relation 5608085 (~5.06 km²) | 1,213 | 134 | 54.44 km |
| CoICT Campus | CoICT Kijitonyama campus, OSM way 478260661 (~7.24 ha) | 22 | 7 | 1.24 km |

**Live explorers:**

- Main campus: https://heed725.github.io/UDSM_Campus_Explorer/
- CoICT only: https://heed725.github.io/UDSM_Campus_Explorer/coict/

## Features

- OpenStreetMap, CARTO light and Esri satellite basemaps.
- Building footprints, roads and paths, amenity markers and campus boundary.
- Search, feature inspection and direct OpenStreetMap source links.
- Amenity categories with distinct map colours, shared map/table filters, category counts and grouped dashboard charts.
- Dashboard charts for buildings, amenities and road lengths.
- Searchable, sortable data table, pagination, map location and CSV export.
- Flood-extent GeoJSON loading, building/amenity exposure analysis and exposed-building filter.
- Separate data and flood analysis for each campus.
- Responsive light interface and keyboard-accessible controls.

There is no bundled flood hazard dataset. Flood exposure starts as **Not assessed**. Your flood files are processed locally in your browser and are not uploaded. A full-campus polygon can be used to check the analysis, but it must not be interpreted as actual flood data.

## GitHub Pages: publish the site

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to **main** and **Folder** to **/docs**.
4. Click **Save** and wait for GitHub's Pages deployment to finish.
5. Open the two explorer links above.

No build tools or API keys are needed. The `.nojekyll` file enables plain static publishing. Future changes to `docs/` on `main` update the published site. The repository's validation workflow checks the source and spatial calculations on every push.

## Run locally on Windows

Download this repository using **Code → Download ZIP**, extract it, and open a terminal in the extracted folder:

```powershell
py -3.10 -m http.server 8000 --directory docs
```

Then open:

- http://localhost:8000/
- http://localhost:8000/coict/

On other systems use `python -m http.server 8000 --directory docs`. Do not open the HTML files directly; browsers restrict GeoJSON loading from file URLs.

## Using a flood layer from QGIS

Export a polygon-only flood-extent layer as **GeoJSON**, with **EPSG:4326 — WGS 84**. In the chosen explorer, click **Load flood GeoJSON**. The dashboard and CSV update after successful validation. Limits: 5 MB, 2,000 polygon features and 150,000 vertices.

A building is exposed when its footprint intersects a supplied flood polygon, including boundary contact. An amenity is exposed when its mapped point falls within or on a supplied polygon. Overlapping flood polygons do not count the same record twice. Roads are not assessed for flood exposure. No occupancy, population, flood depth or damage is inferred.

## Repository structure

```text
docs/                 Complete GitHub Pages website
  index.html          Main-campus explorer
  coict/index.html    CoICT explorer
  config.js           Main-campus configuration
  coict/config.js     CoICT configuration
  data/campus.json    Main-campus GeoJSON dataset
  data/coict.json     CoICT GeoJSON dataset
  app.js              Shared interface and map logic
  analysis.js         Shared flood analysis
  amenity-categories.js  Shared OSM amenity classification
  styles.css          Responsive styling
  vendor/             Bundled Leaflet and Turf, images and licenses
source-data/          Original OSM extracts, gzip-compressed
prepare_data.py       Rebuild either campus dataset
GUIDE.md              Full map/data/flood guide
PAGES_SETUP.md        Publishing checklist
checks/validate.cjs   Source and spatial validation
```

## Rebuild the data

Requires Python and Shapely. Run from the repository root:

```powershell
py -3.10 -m pip install shapely
py -3.10 prepare_data.py --campus main
py -3.10 prepare_data.py --campus coict
```

On other systems replace `py -3.10` with `python`. Both commands use the preserved source extracts, so they require no live data connection. See [GUIDE.md](GUIDE.md) for extraction details and limitations. To run validation with Node.js:

```bash
node checks/validate.cjs
```

## Data sources and attribution

Snapshot date: **2 October 2026**. Geographic data © OpenStreetMap contributors, available under **ODbL 1.0**. The raw extracts and adapted GeoJSON data retain that license; the project's MIT code license does not change the geographic data license.

- [Chuo Kikuu boundary](https://www.openstreetmap.org/relation/5608085)
- [CoICT campus boundary](https://www.openstreetmap.org/way/478260661)
- [Official UDSM CoICT hostel/location information](https://www.udsm.ac.tz/directorate-students-services/coict-hostels)
- [OpenStreetMap copyright and license](https://www.openstreetmap.org/copyright)
- [Reference Tabata app](https://michael-army.shinyapps.io/Tabata/)

Chuo Kikuu is an administrative subward, used here as the requested full-triangle study area. Neither campus outline is a surveyed ownership boundary. Counts reflect mapped OSM objects, not a complete official asset register. Missing, unnamed or duplicated facility records are possible. This is an independent project, not an official UDSM service.

Leaflet 1.9.4 is BSD-2-Clause; Turf 7.2.0 is MIT. Basemap attribution is displayed on the map. See [NOTICE.md](NOTICE.md).

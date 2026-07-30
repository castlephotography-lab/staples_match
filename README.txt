STAPLES ORDER MATCH — CASTLE LABS V1.3 NATIONAL DATABASE

WHAT CHANGED
- Replaced the sample ZIP list with a nationwide offline database
- 41,000+ ZIP/place records covering all 50 states and Washington, D.C.
- Preserves leading-zero ZIP Codes
- Includes city, state, and county-equivalent names
- Correctly labels counties, Louisiana parishes, Alaska boroughs/census areas, and similar jurisdictions
- Live search, five-digit lock-on, Clear, and the unhinged radar remain unchanged

DATA NOTE
The included database is derived from the GeoNames postal-code dataset and redistributed under Creative Commons Attribution 4.0.
Source attribution: GeoNames (www.geonames.org)
GeoNames provides ZIP, place, state, county, and coordinates. This build does not yet include Puerto Rico or other territorial postal datasets. It is not the paid USPS City State Product, so USPS-approved alternate mailing names are not guaranteed.

RUN LOCALLY
Because service workers require a web server, use a simple local server rather than double-clicking index.html.
Example with Python:
  python -m http.server 8000
Then open:
  http://localhost:8000

GITHUB PAGES
Upload all files while preserving the folder structure, then enable GitHub Pages for the repository.

# Thai Address Lookup

Lightweight Thai address lookup engine for Node.js and browser environments. It provides in-memory search and hierarchical data resolution for Thai provinces, districts, subdistricts, and zipcodes.

## Installation

```bash
npm install thai-address-lookup
```
*(Note: Replace with your actual package name if different)*

## Features

- Fully typed with TypeScript.
- Works in both Node.js and browser.
- Fast in-memory array filtering.
- Hierarchical address resolution (Province -> District -> Subdistrict -> Zipcode).
- Support for searching by all fields simultaneously.

## Usage

```typescript
import { 
  searchByZipcode, 
  searchBySubdistrict,
  getUniqueProvinces,
  getDistrictsByProvince 
} from 'thai-address-lookup';

// Example: Search by Zipcode
const results = searchByZipcode('10400');
console.log(results);

// Example: Get all provinces
const provinces = getUniqueProvinces();
console.log(provinces);
```

## API Reference

### Search Functions
- `searchBySubdistrict(keyword: string): ThaiAddress[]`
- `searchByDistrict(keyword: string): ThaiAddress[]`
- `searchByProvince(keyword: string): ThaiAddress[]`
- `searchByZipcode(keyword: string): ThaiAddress[]`
- `searchAllFields(keyword: string): ThaiAddress[]`

### Cascading / Hierarchy
- `getUniqueProvinces(): string[]`
- `getDistrictsByProvince(province: string): string[]`
- `getSubdistrictsByDistrict(province: string, district: string): ThaiAddress[]`
- `getZipcodeByHierarchy(province: string, district: string, subdistrict: string): string | null`
- `getUniqueZipcodes(): string[]`
- `cascadeFromZipcode(zipcode: string): ThaiAddress[]`
- `cascadeFromSubdistrict(subdistrict: string): ThaiAddress[]`

### UI Formatting
- `formatToDropdownOptions(addresses: ThaiAddress[]): DropdownOption[]`

## License

MIT License

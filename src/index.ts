import provincesData from '../data/provinces.json';
import districtsData from '../data/districts.json';
import subDistrictsData from '../data/sub_districts.json';

export interface ThaiAddress {
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
  subdistrictEng: string;
  districtEng: string;
  provinceEng: string;
  subdistrictId: number;
  districtId: number;
  provinceId: number;
}

export interface DropdownOption {
  label: string;
  value: string;
  raw: ThaiAddress;
}

const provinceMap = new Map((provincesData as any[]).map(p => [p.province_id, p]));
const districtMap = new Map((districtsData as any[]).map(d => [d.district_id, d]));

// Load data into memory at app startup and construct the full address structure
const db: ThaiAddress[] = (subDistrictsData as any[]).map(sub => {
  const dist = districtMap.get(sub.district_id);
  const prov = provinceMap.get(dist.province_id);

  return {
    subdistrict: sub.sub_district_name_th,
    district: dist.district_name_th,
    province: prov.province_name_th,
    zipcode: String(sub.zipcode),
    subdistrictEng: sub.sub_district_name_en,
    districtEng: dist.district_name_en,
    provinceEng: prov.province_name_en,
    subdistrictId: sub.sub_district_id,
    districtId: dist.district_id,
    provinceId: prov.province_id,
  };
});

// Helper to clean and format keywords
const clean = (keyword: string) => keyword.trim().toLowerCase();

/**
 * ====================================================
 * 1. SEARCH FUNCTIONS (Field-specific and Combined)
 * ====================================================
 */

export function searchBySubdistrict(keyword: string): ThaiAddress[] {
  const query = clean(keyword);
  if (!query) return [];
  return db.filter(item => 
    item.subdistrict.includes(query) || 
    item.subdistrictEng.toLowerCase().includes(query)
  );
}

export function searchByDistrict(keyword: string): ThaiAddress[] {
  const query = clean(keyword);
  if (!query) return [];
  return db.filter(item => 
    item.district.includes(query) || 
    item.districtEng.toLowerCase().includes(query)
  );
}

export function searchByProvince(keyword: string): ThaiAddress[] {
  const query = clean(keyword);
  if (!query) return [];
  return db.filter(item => 
    item.province.includes(query) || 
    item.provinceEng.toLowerCase().includes(query)
  );
}

export function searchByZipcode(keyword: string): ThaiAddress[] {
  const query = clean(keyword);
  if (!query) return [];
  return db.filter(item => item.zipcode.includes(query));
}

export function searchAllFields(keyword: string): ThaiAddress[] {
  const query = clean(keyword);
  if (!query) return [];
  return db.filter(item => 
    item.subdistrict.includes(query) ||
    item.subdistrictEng.toLowerCase().includes(query) ||
    item.district.includes(query) ||
    item.districtEng.toLowerCase().includes(query) ||
    item.province.includes(query) ||
    item.provinceEng.toLowerCase().includes(query) ||
    item.zipcode.includes(query)
  );
}

/**
 * ====================================================
 * 2. CASCADING DROPDOWN HELPERS (Hierarchical / Reverse Lookup)
 * ====================================================
 */

// [Hierarchical] Step 1: Get all unique provinces
export function getUniqueProvinces(): string[] {
  const provinces = db.map(item => item.province);
  return [...new Set(provinces)].sort((a, b) => a.localeCompare(b, 'th'));
}

// [Hierarchical] Step 2: Get districts by a specific province
export function getDistrictsByProvince(province: string): string[] {
  const cleanProv = province.trim();
  const districts = db
    .filter(item => item.province === cleanProv || item.provinceEng.toLowerCase() === cleanProv.toLowerCase())
    .map(item => item.district);
  return [...new Set(districts)].sort((a, b) => a.localeCompare(b, 'th'));
}

// [Hierarchical] Step 3: Get subdistricts by a specific province and district
export function getSubdistrictsByDistrict(province: string, district: string): ThaiAddress[] {
  const cleanProv = province.trim();
  const cleanDist = district.trim();
  return db.filter(item => 
    (item.province === cleanProv || item.provinceEng.toLowerCase() === cleanProv.toLowerCase()) && 
    (item.district === cleanDist || item.districtEng.toLowerCase() === cleanDist.toLowerCase())
  );
}

// [Hierarchical] Step 4: Autofill zipcode from the 3 selections above
export function getZipcodeByHierarchy(province: string, district: string, subdistrict: string): string | null {
  const match = db.find(
    item => (item.province === province.trim() || item.provinceEng.toLowerCase() === province.trim().toLowerCase()) && 
            (item.district === district.trim() || item.districtEng.toLowerCase() === district.trim().toLowerCase()) && 
            (item.subdistrict === subdistrict.trim() || item.subdistrictEng.toLowerCase() === subdistrict.trim().toLowerCase())
  );
  return match ? match.zipcode : null;
}

// [Reverse Lookup] Get all unique zipcodes (For forms starting with zipcode)
export function getUniqueZipcodes(): string[] {
  const zipcodes = db.map(item => item.zipcode);
  return [...new Set(zipcodes)].sort((a, b) => a.localeCompare(b));
}

// [Reverse Lookup] Search by zipcode to autofill form
export function cascadeFromZipcode(zipcode: string): ThaiAddress[] {
  const query = zipcode.trim();
  if (!query) return [];
  return db.filter(item => item.zipcode === query);
}

// [Reverse Lookup] Search by subdistrict to autofill form
export function cascadeFromSubdistrict(subdistrict: string): ThaiAddress[] {
  const query = subdistrict.trim();
  if (!query) return [];
  return db.filter(item => item.subdistrict === query || item.subdistrictEng.toLowerCase() === query.toLowerCase());
}

/**
 * ====================================================
 * 3. UI FORMATTER (Convert data for Dropdown Component)
 * ====================================================
 */

export function formatToDropdownOptions(addresses: ThaiAddress[]): DropdownOption[] {
  return addresses.map((item) => ({
    label: `ต.${item.subdistrict} อ.${item.district} จ.${item.province} ${item.zipcode}`,
    value: `${item.subdistrict}|${item.district}|${item.province}|${item.zipcode}`,
    raw: item
  }));
}
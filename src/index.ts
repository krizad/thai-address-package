import provincesData from '../data/provinces.json';
import districtsData from '../data/districts.json';
import subDistrictsData from '../data/sub_districts.json';

export interface ThaiAddress {
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  subDistrictEng: string;
  districtEng: string;
  provinceEng: string;
  subDistrictId: number;
  districtId: number;
  provinceId: number;
}

export type ProvinceOnly = Pick<ThaiAddress, 'province' | 'provinceEng' | 'provinceId'>;
export type DistrictOnly = Pick<ThaiAddress, 'district' | 'districtEng' | 'districtId'>;
export type SubDistrictOnly = Pick<ThaiAddress, 'subDistrict' | 'subDistrictEng' | 'subDistrictId'>;

export type SearchLevel = 'all' | 'province' | 'district' | 'subDistrict';

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
    subDistrict: sub.sub_district_name_th,
    district: dist.district_name_th,
    province: prov.province_name_th,
    zipcode: String(sub.zipcode),
    subDistrictEng: sub.sub_district_name_en,
    districtEng: dist.district_name_en,
    provinceEng: prov.province_name_en,
    subDistrictId: sub.sub_district_id,
    districtId: dist.district_id,
    provinceId: prov.province_id,
  };
});

// Helper to clean and format keywords
const clean = (keyword: string) => keyword.trim().toLowerCase();

function formatSearchResult(results: ThaiAddress[], level: SearchLevel): any[] {
  if (level === 'all') return results;
  
  if (level === 'province') {
    const map = new Map<number, ProvinceOnly>();
    results.forEach(r => {
      if (!map.has(r.provinceId)) {
        map.set(r.provinceId, { province: r.province, provinceEng: r.provinceEng, provinceId: r.provinceId });
      }
    });
    return Array.from(map.values());
  }
  
  if (level === 'district') {
    const map = new Map<number, DistrictOnly>();
    results.forEach(r => {
      if (!map.has(r.districtId)) {
        map.set(r.districtId, { district: r.district, districtEng: r.districtEng, districtId: r.districtId });
      }
    });
    return Array.from(map.values());
  }
  
  if (level === 'subDistrict') {
    const map = new Map<number, SubDistrictOnly>();
    results.forEach(r => {
      if (!map.has(r.subDistrictId)) {
        map.set(r.subDistrictId, { subDistrict: r.subDistrict, subDistrictEng: r.subDistrictEng, subDistrictId: r.subDistrictId });
      }
    });
    return Array.from(map.values());
  }
  
  return results;
}

/**
 * ====================================================
 * 1. SEARCH FUNCTIONS (Field-specific and Combined)
 * ====================================================
 */

export function searchBySubDistrict(keyword: string, level?: 'all'): ThaiAddress[];
export function searchBySubDistrict(keyword: string, level: 'province'): ProvinceOnly[];
export function searchBySubDistrict(keyword: string, level: 'district'): DistrictOnly[];
export function searchBySubDistrict(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchBySubDistrict(keyword: string, level: SearchLevel = 'all'): any[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => 
    item.subDistrict.includes(query) || 
    item.subDistrictEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

export function searchByDistrict(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByDistrict(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByDistrict(keyword: string, level: 'district'): DistrictOnly[];
export function searchByDistrict(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByDistrict(keyword: string, level: SearchLevel = 'all'): any[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => 
    item.district.includes(query) || 
    item.districtEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

export function searchByProvince(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByProvince(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByProvince(keyword: string, level: 'district'): DistrictOnly[];
export function searchByProvince(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByProvince(keyword: string, level: SearchLevel = 'all'): any[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => 
    item.province.includes(query) || 
    item.provinceEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

export function searchByZipcode(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByZipcode(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByZipcode(keyword: string, level: 'district'): DistrictOnly[];
export function searchByZipcode(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByZipcode(keyword: string, level: SearchLevel = 'all'): any[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => item.zipcode.includes(query));
  return formatSearchResult(results, level);
}

export function searchAllFields(keyword: string, level?: 'all'): ThaiAddress[];
export function searchAllFields(keyword: string, level: 'province'): ProvinceOnly[];
export function searchAllFields(keyword: string, level: 'district'): DistrictOnly[];
export function searchAllFields(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchAllFields(keyword: string, level: SearchLevel = 'all'): any[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => 
    item.subDistrict.includes(query) ||
    item.subDistrictEng.toLowerCase().includes(query) ||
    item.district.includes(query) ||
    item.districtEng.toLowerCase().includes(query) ||
    item.province.includes(query) ||
    item.provinceEng.toLowerCase().includes(query) ||
    item.zipcode.includes(query)
  );
  return formatSearchResult(results, level);
}

/**
 * ====================================================
 * 2. CASCADING DROPDOWN HELPERS (Hierarchical / Reverse Lookup)
 * ====================================================
 */

// [New Feature] Unified Dropdown List Generator
export function getDropdownList(
  level: 'province' | 'district' | 'subDistrict',
  parentLocation?: { province?: string; district?: string }
): string[] {
  if (level === 'province') {
    return getUniqueProvinces();
  }

  if (level === 'district') {
    if (!parentLocation?.province) return [];
    return getDistrictsByProvince(parentLocation.province);
  }

  if (level === 'subDistrict') {
    if (!parentLocation?.province || !parentLocation?.district) return [];
    const subs = getSubDistrictsByDistrict(parentLocation.province, parentLocation.district);
    const subNames = subs.map(item => item.subDistrict);
    return [...new Set(subNames)].sort((a, b) => a.localeCompare(b, 'th'));
  }

  return [];
}

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

// [Hierarchical] Step 3: Get subDistricts by a specific province and district
export function getSubDistrictsByDistrict(province: string, district: string): ThaiAddress[] {
  const cleanProv = province.trim();
  const cleanDist = district.trim();
  return db.filter(item => 
    (item.province === cleanProv || item.provinceEng.toLowerCase() === cleanProv.toLowerCase()) && 
    (item.district === cleanDist || item.districtEng.toLowerCase() === cleanDist.toLowerCase())
  );
}

// [Hierarchical] Step 4: Autofill zipcode from the 3 selections above
export function getZipcodeByHierarchy(province: string, district: string, subDistrict: string): string | null {
  const match = db.find(
    item => (item.province === province.trim() || item.provinceEng.toLowerCase() === province.trim().toLowerCase()) && 
            (item.district === district.trim() || item.districtEng.toLowerCase() === district.trim().toLowerCase()) && 
            (item.subDistrict === subDistrict.trim() || item.subDistrictEng.toLowerCase() === subDistrict.trim().toLowerCase())
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

// [Reverse Lookup] Search by subDistrict to autofill form
export function cascadeFromSubDistrict(subDistrict: string): ThaiAddress[] {
  const query = subDistrict.trim();
  if (!query) return [];
  return db.filter(item => item.subDistrict === query || item.subDistrictEng.toLowerCase() === query.toLowerCase());
}

/**
 * ====================================================
 * 3. UI FORMATTER (Convert data for Dropdown Component)
 * ====================================================
 */

export function formatToDropdownOptions(addresses: ThaiAddress[]): DropdownOption[] {
  return addresses.map((item) => ({
    label: `ต.${item.subDistrict} อ.${item.district} จ.${item.province} ${item.zipcode}`,
    value: `${item.subDistrict}|${item.district}|${item.province}|${item.zipcode}`,
    raw: item
  }));
}
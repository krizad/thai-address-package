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
export type DistrictOnly = Pick<ThaiAddress, 'district' | 'districtEng' | 'districtId' | 'province' | 'provinceEng' | 'provinceId'>;
export type SubDistrictOnly = Pick<ThaiAddress, 'subDistrict' | 'subDistrictEng' | 'subDistrictId' | 'district' | 'districtEng' | 'districtId' | 'province' | 'provinceEng' | 'provinceId'>;

export type SearchLevel = 'all' | 'province' | 'district' | 'subDistrict';

export interface DropdownOption {
  label: string;
  value: string;
  raw: ThaiAddress;
}

interface ProvinceRaw {
  province_id: number;
  province_name_th: string;
  province_name_en: string;
}

interface DistrictRaw {
  district_id: number;
  province_id: number;
  district_name_th: string;
  district_name_en: string;
}

interface SubDistrictRaw {
  sub_district_id: number;
  district_id: number;
  sub_district_name_th: string;
  sub_district_name_en: string;
  zipcode: number | string;
}

const provinceMap = new Map((provincesData as ProvinceRaw[]).map(p => [p.province_id, p]));
const districtMap = new Map((districtsData as DistrictRaw[]).map(d => [d.district_id, d]));

const db: ThaiAddress[] = (subDistrictsData as SubDistrictRaw[]).map(sub => {
  const dist = districtMap.get(sub.district_id)!;
  const prov = provinceMap.get(dist.province_id)!;

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

const clean = (keyword: string): string => keyword.trim().toLowerCase();

function formatSearchResult(results: ThaiAddress[], level: SearchLevel): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
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
        map.set(r.districtId, {
          district: r.district, districtEng: r.districtEng, districtId: r.districtId,
          province: r.province, provinceEng: r.provinceEng, provinceId: r.provinceId
        });
      }
    });
    return Array.from(map.values());
  }

  if (level === 'subDistrict') {
    const map = new Map<number, SubDistrictOnly>();
    results.forEach(r => {
      if (!map.has(r.subDistrictId)) {
        map.set(r.subDistrictId, {
          subDistrict: r.subDistrict, subDistrictEng: r.subDistrictEng, subDistrictId: r.subDistrictId,
          district: r.district, districtEng: r.districtEng, districtId: r.districtId,
          province: r.province, provinceEng: r.provinceEng, provinceId: r.provinceId
        });
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

/**
 * Search addresses by sub-district name (Thai or English).
 * @param keyword - The sub-district name to search for (supports partial match in Thai or English).
 * @param level - The level of detail to return: 'all' (default), 'province', 'district', or 'subDistrict'.
 */
export function searchBySubDistrict(keyword: string, level?: 'all'): ThaiAddress[];
export function searchBySubDistrict(keyword: string, level: 'province'): ProvinceOnly[];
export function searchBySubDistrict(keyword: string, level: 'district'): DistrictOnly[];
export function searchBySubDistrict(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchBySubDistrict(keyword: string, level: SearchLevel = 'all'): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item =>
    item.subDistrict.includes(query) ||
    item.subDistrictEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

/**
 * Search addresses by district name (Thai or English).
 * @param keyword - The district name to search for (supports partial match in Thai or English).
 * @param level - The level of detail to return: 'all' (default), 'province', 'district', or 'subDistrict'.
 */
export function searchByDistrict(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByDistrict(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByDistrict(keyword: string, level: 'district'): DistrictOnly[];
export function searchByDistrict(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByDistrict(keyword: string, level: SearchLevel = 'all'): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item =>
    item.district.includes(query) ||
    item.districtEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

/**
 * Search addresses by province name (Thai or English).
 * @param keyword - The province name to search for (supports partial match in Thai or English).
 * @param level - The level of detail to return: 'all' (default), 'province', 'district', or 'subDistrict'.
 */
export function searchByProvince(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByProvince(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByProvince(keyword: string, level: 'district'): DistrictOnly[];
export function searchByProvince(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByProvince(keyword: string, level: SearchLevel = 'all'): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item =>
    item.province.includes(query) ||
    item.provinceEng.toLowerCase().includes(query)
  );
  return formatSearchResult(results, level);
}

/**
 * Search addresses by zipcode.
 * @param keyword - The zipcode to search for (supports partial match).
 * @param level - The level of detail to return: 'all' (default), 'province', 'district', or 'subDistrict'.
 */
export function searchByZipcode(keyword: string, level?: 'all'): ThaiAddress[];
export function searchByZipcode(keyword: string, level: 'province'): ProvinceOnly[];
export function searchByZipcode(keyword: string, level: 'district'): DistrictOnly[];
export function searchByZipcode(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchByZipcode(keyword: string, level: SearchLevel = 'all'): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
  const query = clean(keyword);
  if (!query) return [];
  const results = db.filter(item => item.zipcode.includes(query));
  return formatSearchResult(results, level);
}

/**
 * Search addresses across all fields (sub-district, district, province, and zipcode).
 * @param keyword - The keyword to search for across all address fields (supports partial match in Thai or English).
 * @param level - The level of detail to return: 'all' (default), 'province', 'district', or 'subDistrict'.
 */
export function searchAllFields(keyword: string, level?: 'all'): ThaiAddress[];
export function searchAllFields(keyword: string, level: 'province'): ProvinceOnly[];
export function searchAllFields(keyword: string, level: 'district'): DistrictOnly[];
export function searchAllFields(keyword: string, level: 'subDistrict'): SubDistrictOnly[];
export function searchAllFields(keyword: string, level: SearchLevel = 'all'): ThaiAddress[] | ProvinceOnly[] | DistrictOnly[] | SubDistrictOnly[] {
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

/**
 * Get a list of unique values for a dropdown at the specified level, optionally filtered by a parent location.
 * @param level - The dropdown level to retrieve: 'province', 'district', or 'subDistrict'.
 * @param parentLocation - The parent location to filter by. Required for 'district' (needs province) and 'subDistrict' (needs province + district).
 */
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

/**
 * Get all unique province names sorted in Thai alphabetical order.
 */
export function getUniqueProvinces(): string[] {
  const provinces = db.map(item => item.province);
  return [...new Set(provinces)].sort((a, b) => a.localeCompare(b, 'th'));
}

/**
 * Get unique district names within a given province.
 * @param province - The province name in Thai or English (case-insensitive English match).
 */
export function getDistrictsByProvince(province: string): string[] {
  const cleanProv = province.trim();
  const districts = db
    .filter(item => item.province === cleanProv || item.provinceEng.toLowerCase() === cleanProv.toLowerCase())
    .map(item => item.district);
  return [...new Set(districts)].sort((a, b) => a.localeCompare(b, 'th'));
}

/**
 * Get all sub-district address entries matching the given province and district.
 * @param province - The province name in Thai or English (case-insensitive English match).
 * @param district - The district name in Thai or English (case-insensitive English match).
 */
export function getSubDistrictsByDistrict(province: string, district: string): ThaiAddress[] {
  const cleanProv = province.trim();
  const cleanDist = district.trim();
  return db.filter(item =>
    (item.province === cleanProv || item.provinceEng.toLowerCase() === cleanProv.toLowerCase()) &&
    (item.district === cleanDist || item.districtEng.toLowerCase() === cleanDist.toLowerCase())
  );
}

/**
 * Look up the zipcode for a specific sub-district within a province and district.
 * @param province - The province name in Thai or English (case-insensitive English match).
 * @param district - The district name in Thai or English (case-insensitive English match).
 * @param subDistrict - The sub-district name in Thai or English (case-insensitive English match).
 * @returns The matching zipcode, or null if no match is found.
 */
export function getZipcodeByHierarchy(province: string, district: string, subDistrict: string): string | null {
  const match = db.find(
    item => (item.province === province.trim() || item.provinceEng.toLowerCase() === province.trim().toLowerCase()) &&
            (item.district === district.trim() || item.districtEng.toLowerCase() === district.trim().toLowerCase()) &&
            (item.subDistrict === subDistrict.trim() || item.subDistrictEng.toLowerCase() === subDistrict.trim().toLowerCase())
  );
  return match ? match.zipcode : null;
}

/**
 * Get all unique zipcodes sorted in ascending order.
 */
export function getUniqueZipcodes(): string[] {
  const zipcodes = db.map(item => item.zipcode);
  return [...new Set(zipcodes)].sort((a, b) => a.localeCompare(b));
}

/**
 * Find all address entries matching an exact zipcode.
 * @param zipcode - The exact zipcode to search for.
 */
export function cascadeFromZipcode(zipcode: string): ThaiAddress[] {
  const query = zipcode.trim();
  if (!query) return [];
  return db.filter(item => item.zipcode === query);
}

/**
 * Find all address entries matching a sub-district name (Thai or English).
 * @param subDistrict - The sub-district name in Thai or English (case-insensitive English match).
 */
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

/**
 * Convert an array of ThaiAddress entries into dropdown options with formatted labels and pipe-delimited values.
 * @param addresses - The array of ThaiAddress entries to format.
 * @param separator - The separator string between address parts in the label. Defaults to a single space.
 */
export function formatToDropdownOptions(addresses: ThaiAddress[], separator: string = " "): DropdownOption[] {
  return addresses.map((item) => ({
    label: `ต.${item.subDistrict}${separator}อ.${item.district}${separator}จ.${item.province}${separator}${item.zipcode}`,
    value: `${item.subDistrict}|${item.district}|${item.province}|${item.zipcode}`,
    raw: item
  }));
}
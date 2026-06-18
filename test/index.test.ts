import { describe, it, expect } from 'vitest';
import {
  searchBySubDistrict,
  searchByDistrict,
  searchByProvince,
  searchByZipcode,
  searchAllFields,
  getDropdownList,
  getUniqueProvinces,
  getDistrictsByProvince,
  getSubDistrictsByDistrict,
  getZipcodeByHierarchy,
  getUniqueZipcodes,
  cascadeFromZipcode,
  cascadeFromSubDistrict,
  formatToDropdownOptions,
} from '../src/index';
import type { ThaiAddress, ProvinceOnly, DistrictOnly, SubDistrictOnly } from '../src/index';

describe('searchBySubDistrict', () => {
  it('should find results by Thai sub-district name', () => {
    const results = searchBySubDistrict('ทุ่งพญาไท');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subDistrict).toContain('พญาไท');
  });

  it('should find results by English sub-district name', () => {
    const results = searchBySubDistrict('Phaya Thai');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subDistrictEng).toMatch(/Phaya Thai/i);
  });

  it('should return empty array for empty keyword', () => {
    expect(searchBySubDistrict('')).toEqual([]);
    expect(searchBySubDistrict('   ')).toEqual([]);
  });

  it('should return full ThaiAddress when level is "all"', () => {
    const results = searchBySubDistrict('ทุ่งพญาไท', 'all');
    expect(results.length).toBeGreaterThan(0);
    const item = results[0] as ThaiAddress;
    expect(item).toHaveProperty('subDistrict');
    expect(item).toHaveProperty('district');
    expect(item).toHaveProperty('province');
    expect(item).toHaveProperty('zipcode');
  });

  it('should return ProvinceOnly when level is "province"', () => {
    const results = searchBySubDistrict('ทุ่งพญาไท', 'province');
    expect(results.length).toBeGreaterThan(0);
    const item = results[0] as ProvinceOnly;
    expect(item).toHaveProperty('province');
    expect(item).toHaveProperty('provinceEng');
    expect(item).toHaveProperty('provinceId');
    expect(item).not.toHaveProperty('subDistrict');
  });

  it('should return DistrictOnly when level is "district"', () => {
    const results = searchBySubDistrict('ทุ่งพญาไท', 'district');
    expect(results.length).toBeGreaterThan(0);
    const item = results[0] as DistrictOnly;
    expect(item).toHaveProperty('district');
    expect(item).toHaveProperty('province');
    expect(item).not.toHaveProperty('subDistrict');
  });

  it('should return SubDistrictOnly when level is "subDistrict"', () => {
    const results = searchBySubDistrict('ทุ่งพญาไท', 'subDistrict');
    expect(results.length).toBeGreaterThan(0);
    const item = results[0] as SubDistrictOnly;
    expect(item).toHaveProperty('subDistrict');
    expect(item).toHaveProperty('subDistrictEng');
    expect(item).toHaveProperty('subDistrictId');
    expect(item).toHaveProperty('district');
    expect(item).toHaveProperty('province');
  });

  it('should deduplicate province results', () => {
    const results = searchBySubDistrict('บาง', 'province');
    const ids = (results as ProvinceOnly[]).map(r => r.provinceId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('searchByDistrict', () => {
  it('should find results by Thai district name', () => {
    const results = searchByDistrict('พญาไท');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should find results by English district name', () => {
    const results = searchByDistrict('Phaya Thai');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array for empty keyword', () => {
    expect(searchByDistrict('')).toEqual([]);
  });
});

describe('searchByProvince', () => {
  it('should find results by Thai province name', () => {
    const results = searchByProvince('กรุงเทพ');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should find results by English province name', () => {
    const results = searchByProvince('Bangkok');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return provinces with level "province"', () => {
    const results = searchByProvince('กรุงเทพ', 'province');
    const provinces = results as ProvinceOnly[];
    expect(provinces.length).toBe(1);
    expect(provinces[0].province).toBe('กรุงเทพมหานคร');
  });

  it('should return empty array for empty keyword', () => {
    expect(searchByProvince('')).toEqual([]);
  });
});

describe('searchByZipcode', () => {
  it('should find results by exact zipcode', () => {
    const results = searchByZipcode('10400');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].zipcode).toBe('10400');
  });

  it('should support partial zipcode match', () => {
    const results = searchByZipcode('104');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array for empty keyword', () => {
    expect(searchByZipcode('')).toEqual([]);
  });
});

describe('searchAllFields', () => {
  it('should search across all fields', () => {
    const byZip = searchAllFields('10400');
    expect(byZip.length).toBeGreaterThan(0);

    const byProvince = searchAllFields('Bangkok');
    expect(byProvince.length).toBeGreaterThan(0);
  });

  it('should return empty array for empty keyword', () => {
    expect(searchAllFields('')).toEqual([]);
  });

  it('should support level parameter', () => {
    const results = searchAllFields('กรุงเทพ', 'province');
    const provinces = results as ProvinceOnly[];
    expect(provinces.length).toBe(1);
    expect(provinces[0].province).toBe('กรุงเทพมหานคร');
  });
});

describe('getDropdownList', () => {
  it('should return all provinces when level is "province"', () => {
    const provinces = getDropdownList('province');
    expect(provinces.length).toBeGreaterThan(0);
    expect(provinces).toContain('กรุงเทพมหานคร');
  });

  it('should return empty array for "district" without province', () => {
    expect(getDropdownList('district')).toEqual([]);
  });

  it('should return districts when province is provided', () => {
    const districts = getDropdownList('district', { province: 'กรุงเทพมหานคร' });
    expect(districts.length).toBeGreaterThan(0);
  });

  it('should return empty array for "subDistrict" without province and district', () => {
    expect(getDropdownList('subDistrict')).toEqual([]);
    expect(getDropdownList('subDistrict', { province: 'กรุงเทพมหานคร' })).toEqual([]);
  });

  it('should return sub-districts when province and district are provided', () => {
    const subs = getDropdownList('subDistrict', {
      province: 'กรุงเทพมหานคร',
      district: 'พญาไท',
    });
    expect(subs.length).toBeGreaterThan(0);
  });

  it('should support English province names', () => {
    const districts = getDropdownList('district', { province: 'Bangkok' });
    expect(districts.length).toBeGreaterThan(0);
  });
});

describe('getUniqueProvinces', () => {
  it('should return all 77 unique provinces', () => {
    const provinces = getUniqueProvinces();
    expect(provinces.length).toBe(77);
    expect(provinces).toContain('กรุงเทพมหานคร');
  });

  it('should return sorted provinces', () => {
    const provinces = getUniqueProvinces();
    const sorted = [...provinces].sort((a, b) => a.localeCompare(b, 'th'));
    expect(provinces).toEqual(sorted);
  });
});

describe('getDistrictsByProvince', () => {
  it('should return districts for a Thai province name', () => {
    const districts = getDistrictsByProvince('กรุงเทพมหานคร');
    expect(districts.length).toBeGreaterThan(0);
  });

  it('should return districts for an English province name', () => {
    const districts = getDistrictsByProvince('Bangkok');
    expect(districts.length).toBeGreaterThan(0);
  });

  it('should return empty for unknown province', () => {
    expect(getDistrictsByProvince('NonExistent')).toEqual([]);
  });
});

describe('getSubDistrictsByDistrict', () => {
  it('should return sub-districts for a province and district', () => {
    const subs = getSubDistrictsByDistrict('กรุงเทพมหานคร', 'พญาไท');
    expect(subs.length).toBeGreaterThan(0);
    expect(subs[0].district).toBe('พญาไท');
  });

  it('should support English names', () => {
    const subs = getSubDistrictsByDistrict('Bangkok', 'Phaya Thai');
    expect(subs.length).toBeGreaterThan(0);
  });
});

describe('getZipcodeByHierarchy', () => {
  it('should return zipcode for valid hierarchy', () => {
    const zipcode = getZipcodeByHierarchy('กรุงเทพมหานคร', 'พญาไท', 'สามเสนใน');
    expect(zipcode).toBe('10400');
  });

  it('should return null for invalid hierarchy', () => {
    const zipcode = getZipcodeByHierarchy('NonExistent', 'NonExistent', 'NonExistent');
    expect(zipcode).toBeNull();
  });

  it('should support English names', () => {
    const zipcode = getZipcodeByHierarchy('Bangkok', 'Phaya Thai', 'Samsen Nai');
    expect(zipcode).toBe('10400');
  });
});

describe('getUniqueZipcodes', () => {
  it('should return sorted unique zipcodes', () => {
    const zips = getUniqueZipcodes();
    expect(zips.length).toBeGreaterThan(0);
    const sorted = [...zips].sort((a, b) => a.localeCompare(b));
    expect(zips).toEqual(sorted);
  });
});

describe('cascadeFromZipcode', () => {
  it('should find addresses by exact zipcode', () => {
    const results = cascadeFromZipcode('10400');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].zipcode).toBe('10400');
  });

  it('should return empty array for empty input', () => {
    expect(cascadeFromZipcode('')).toEqual([]);
  });

  it('should return empty array for nonexistent zipcode', () => {
    expect(cascadeFromZipcode('99999')).toEqual([]);
  });
});

describe('cascadeFromSubDistrict', () => {
  it('should find addresses by exact Thai sub-district name', () => {
    const results = cascadeFromSubDistrict('สามเสนใน');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subDistrict).toBe('สามเสนใน');
  });

  it('should find addresses by English sub-district name', () => {
    const results = cascadeFromSubDistrict('Samsen Nai');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array for empty input', () => {
    expect(cascadeFromSubDistrict('')).toEqual([]);
  });
});

describe('formatToDropdownOptions', () => {
  it('should format addresses into dropdown options', () => {
    const addresses = searchByZipcode('10400');
    const options = formatToDropdownOptions(addresses);
    expect(options.length).toBe(addresses.length);
    expect(options[0]).toHaveProperty('label');
    expect(options[0]).toHaveProperty('value');
    expect(options[0]).toHaveProperty('raw');
  });

  it('should use default separator (space)', () => {
    const addresses = searchByZipcode('10400');
    const options = formatToDropdownOptions(addresses);
    expect(options[0].label).toContain(' ');
  });

  it('should use custom separator', () => {
    const addresses = searchByZipcode('10400');
    const options = formatToDropdownOptions(addresses, ' - ');
    expect(options[0].label).toContain(' - ');
  });

  it('should create pipe-delimited value', () => {
    const addresses = searchByZipcode('10400');
    const options = formatToDropdownOptions(addresses);
    expect(options[0].value).toContain('|');
  });
});
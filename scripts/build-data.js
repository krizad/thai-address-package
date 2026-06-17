const fs = require('fs');
const path = require('path');

const rawData = require('../data/address.json');

const provinces = new Map();
const districts = new Map();
const subDistricts = new Map();

for (const item of rawData) {
  // Province
  if (!provinces.has(item.province_id)) {
    provinces.set(item.province_id, {
      province_id: item.province_id,
      province_name_th: item.province_name_th,
      province_name_en: item.province_name_en,
    });
  }

  // District
  if (!districts.has(item.district_id)) {
    districts.set(item.district_id, {
      district_id: item.district_id,
      province_id: item.province_id,
      district_name_th: item.district_name_th,
      district_name_en: item.district_name_en,
    });
  }

  // Sub-district
  if (!subDistricts.has(item.sub_district_id)) {
    subDistricts.set(item.sub_district_id, {
      sub_district_id: item.sub_district_id,
      district_id: item.district_id,
      sub_district_name_th: item.sub_district_name_th,
      sub_district_name_en: item.sub_district_name_en,
      zipcode: item.zipcode
    });
  }
}

// Convert Map to sorted array
const sortedProvinces = Array.from(provinces.values()).sort((a, b) => a.province_id - b.province_id);
const sortedDistricts = Array.from(districts.values()).sort((a, b) => a.district_id - b.district_id);
const sortedSubDistricts = Array.from(subDistricts.values()).sort((a, b) => a.sub_district_id - b.sub_district_id);

// Write to files
fs.writeFileSync(path.join(__dirname, '../data/provinces.json'), JSON.stringify(sortedProvinces, null, 0));
fs.writeFileSync(path.join(__dirname, '../data/districts.json'), JSON.stringify(sortedDistricts, null, 0));
fs.writeFileSync(path.join(__dirname, '../data/sub_districts.json'), JSON.stringify(sortedSubDistricts, null, 0));

console.log('Data separated successfully!');
console.log('Provinces:', sortedProvinces.length);
console.log('Districts:', sortedDistricts.length);
console.log('Sub-districts:', sortedSubDistricts.length);

# Thai Location Kit

แพ็กเกจสำหรับค้นหาและจัดการข้อมูลที่อยู่ประเทศไทย (ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์) ที่มีขนาดเล็ก รวดเร็ว และใช้งานง่าย รองรับทั้ง Node.js และ Browser เขียนด้วย TypeScript

✨ **[ดูตัวอย่างการใช้งาน (Live Demo)](https://krizad.github.io/thai-address-demo/)**

## 🌟 จุดเด่น (Features)

- **ทำงานแบบ In-memory:** โหลดข้อมูลและค้นหาได้อย่างรวดเร็ว ไม่ต้องต่อ API
- **รองรับ TypeScript:** มี Type definition ครบถ้วน (`ThaiAddress`)
- **การค้นหาที่ยืดหยุ่น:** ค้นหาได้ทั้งแบบแยกฟิลด์ หรือค้นหาจากทุกฟิลด์รวมกัน
- **รองรับการระบุ Level เพื่อคืนค่าเฉพาะเจาะจง:** สามารถระบุได้ว่าจะคืนค่าเฉพาะ จังหวัด, อำเภอ, หรือ ตำบล (ตัดข้อมูลที่ซ้ำซ้อนออกให้อัตโนมัติ)
- **รองรับระบบ Dropdown (Cascading):** ฟังก์ชันสำหรับดึงข้อมูลเป็นลำดับชั้น (จังหวัด -> อำเภอ -> ตำบล -> รหัสไปรษณีย์) สำหรับทำฟอร์มกรอกที่อยู่ พร้อมฟังก์ชันแบบ Unified ดึงข้อมูลตาม Level
- **รองรับการค้นหาด้วยภาษาอังกฤษ:** สามารถค้นหาชื่อตำบล อำเภอ จังหวัด ด้วยภาษาอังกฤษได้

## 📦 การติดตั้ง (Installation)

ติดตั้งผ่าน npm หรือ yarn:

```bash
npm install @krizad/thai-address-helper
# หรือ
yarn add @krizad/thai-address-helper
# หรือ
pnpm add @krizad/thai-address-helper
```

## 🚀 ตัวอย่างการใช้งาน (Usage & Examples)

### 1. การค้นหาข้อมูลแบบกำหนด Level (Targeted Search)

คุณสามารถค้นหาข้อมูลที่อยู่และระบุ `level` เพื่อให้คืนค่าเฉพาะข้อมูลในระดับที่ต้องการ (เช่น คืนค่าเฉพาะระดับจังหวัด หรือ อำเภอ) ระบบจะกรองข้อมูลที่ซ้ำซ้อนออกให้โดยอัตโนมัติ 
**หมายเหตุ:** ข้อมูลที่คืนค่าจะรวมถึงข้อมูลในระดับบนที่เกี่ยวข้อง (Top-level) ของสิ่งที่ค้นเจอติดมาด้วย (เช่น ถ้าระบุ level `subDistrict` จะได้ข้อมูล `district` และ `province` ติดมาด้วยเสมอ)

```typescript
import { searchAllFields, searchByProvince } from '@krizad/thai-address-helper';

// คืนค่าที่อยู่ทั้งหมดเต็มรูปแบบ (default)
const allFields = searchAllFields('บาง'); 

// คืนค่าเฉพาะรายชื่อจังหวัดที่มีคำว่า "บาง"
const provinceOnly = searchAllFields('บาง', 'province'); 
/* 
[
  { province: 'กรุงเทพมหานคร', provinceEng: 'Bangkok', provinceId: 1 },
  { province: 'ชลบุรี', provinceEng: 'Chon Buri', provinceId: 20 },
  ...
]
*/

// คืนค่าเฉพาะรายชื่ออำเภอที่อยู่ในจังหวัด "เชียงใหม่"
const districtOnly = searchByProvince('เชียงใหม่', 'district');
/*
[
  { district: 'เมืองเชียงใหม่', districtEng: 'Mueang Chiang Mai', districtId: ... },
  ...
]
*/
```

### 2. การสร้างแบบฟอร์มที่อยู่ด้วย Unified Dropdown (Cascading)

ฟังก์ชัน `getDropdownList` ช่วยให้การสร้าง Dropdown List เป็นเรื่องง่าย โดยคืนค่าเป็น array ของ String `string[]` ทันที

```typescript
import { getDropdownList, getZipcodeByHierarchy } from '@krizad/thai-address-helper';

// สเต็ปที่ 1: ดึงรายชื่อจังหวัดทั้งหมด เพื่อนำไปสร้าง Dropdown จังหวัด
const provinces = getDropdownList('province'); 
// ['กระบี่', 'กรุงเทพมหานคร', 'กาญจนบุรี', ...]

// สเต็ปที่ 2: เมื่อผู้ใช้เลือกจังหวัด ให้ดึงรายชื่ออำเภอในจังหวัดนั้น
const districtsInBkk = getDropdownList('district', { province: 'กรุงเทพมหานคร' });
// ['เขตคลองสาน', 'เขตคลองเตย', 'เขตจตุจักร', ...]

// สเต็ปที่ 3: เมื่อผู้ใช้เลือกอำเภอ ให้ดึงรายชื่อตำบล
const subDistrictsInChatuchak = getDropdownList('subDistrict', { 
  province: 'กรุงเทพมหานคร', 
  district: 'เขตจตุจักร' 
});
// ['จตุจักร', 'จอมพล', ...]

// สเต็ปที่ 4: เติมรหัสไปรษณีย์อัตโนมัติเมื่อเลือกครบ
const zipcode = getZipcodeByHierarchy('กรุงเทพมหานคร', 'เขตจตุจักร', 'จอมพล');
// '10900'
```

### 3. การสร้าง Auto-complete Form จากรหัสไปรษณีย์

หากต้องการให้ผู้ใช้กรอก รหัสไปรษณีย์ หรือ ตำบล แล้วฟอร์มเติมอำเภอและจังหวัดให้อัตโนมัติ:

```typescript
import { cascadeFromZipcode, cascadeFromSubDistrict } from '@krizad/thai-address-helper';

// เมื่อกรอก 10400 จะได้รายการที่อยู่เพื่อนำไปเติมอัตโนมัติ
const addresses = cascadeFromZipcode('10400');

// หรือค้นหาจากตำบล
const addressesFromSub = cascadeFromSubDistrict('ดินแดง');
```

### 4. การเตรียมข้อมูลสำหรับ UI Dropdown

ฟังก์ชัน `formatToDropdownOptions` ช่วยแปลงรูปแบบข้อมูลให้พร้อมใช้งานกับ Component Dropdown ทั่วไป เช่น React-Select โดยสามารถระบุตัวคั่น `separator` ระหว่างข้อมูลได้ (ค่าเริ่มต้นคือ `" "`)

```typescript
import { searchByZipcode, formatToDropdownOptions } from '@krizad/thai-address-helper';

const rawData = searchByZipcode('10400');

// ตัวอย่างการใช้ตัวคั่นด้วยช่องว่าง (Default)
const options1 = formatToDropdownOptions(rawData);

// ตัวอย่างการกำหนดตัวคั่นเอง (เช่น ' - ')
const options2 = formatToDropdownOptions(rawData, ' - ');

console.log(options2);
/* 
[
  {
    label: "ต.พญาไท - อ.พญาไท - จ.กรุงเทพมหานคร - 10400",
    value: "พญาไท|พญาไท|กรุงเทพมหานคร|10400",
    raw: { ...ข้อมูลต้นฉบับ }
  },
  ...
]
*/
```

## 📚 API Reference

### โครงสร้างข้อมูล (Models & Interfaces)

```typescript
export interface ThaiAddress {
  subDistrict: string;    // ชื่อตำบล (ภาษาไทย)
  district: string;       // ชื่ออำเภอ (ภาษาไทย)
  province: string;       // ชื่อจังหวัด (ภาษาไทย)
  zipcode: string;        // รหัสไปรษณีย์
  subDistrictEng: string; // ชื่อตำบล (ภาษาอังกฤษ)
  districtEng: string;    // ชื่ออำเภอ (ภาษาอังกฤษ)
  provinceEng: string;    // ชื่อจังหวัด (ภาษาอังกฤษ)
  subDistrictId: number;  // รหัสตำบล
  districtId: number;     // รหัสอำเภอ
  provinceId: number;     // รหัสจังหวัด
}

export type SearchLevel = 'all' | 'province' | 'district' | 'subDistrict';

export interface DropdownOption {
  label: string;          // ข้อความสำหรับแสดงใน Dropdown
  value: string;          // ค่า Value สำหรับอ้างอิง
  raw: ThaiAddress;       // ข้อมูลที่อยู่ต้นฉบับ
}
```

### หมวดหมู่การค้นหา (Search Functions)
*สามารถระบุ parameter ตัวที่สองเป็น `SearchLevel` เพื่อจำกัดข้อมูลที่คืนค่ากลับมาได้*

- `searchBySubDistrict(keyword: string, level?: SearchLevel): any[]`
- `searchByDistrict(keyword: string, level?: SearchLevel): any[]`
- `searchByProvince(keyword: string, level?: SearchLevel): any[]`
- `searchByZipcode(keyword: string, level?: SearchLevel): any[]`
- `searchAllFields(keyword: string, level?: SearchLevel): any[]`

### หมวดหมู่แบบฟอร์มลำดับชั้น (Cascading / Hierarchy)

- `getDropdownList(level: 'province' | 'district' | 'subDistrict', parentLocation?: { province?: string, district?: string }): string[]`
- `getUniqueProvinces(): string[]`
- `getDistrictsByProvince(province: string): string[]`
- `getSubDistrictsByDistrict(province: string, district: string): ThaiAddress[]`
- `getZipcodeByHierarchy(province: string, district: string, subDistrict: string): string | null`
- `getUniqueZipcodes(): string[]`
- `cascadeFromZipcode(zipcode: string): ThaiAddress[]`
- `cascadeFromSubDistrict(subDistrict: string): ThaiAddress[]`

### หมวดหมู่จัดรูปแบบ UI (UI Formatting)

- `formatToDropdownOptions(addresses: ThaiAddress[], separator?: string): DropdownOption[]`

## 📄 License

MIT License

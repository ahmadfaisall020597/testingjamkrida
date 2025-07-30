import { LOGOS } from "./variableGlobal/varLogo";

// function getDomain(email) {
//   console.log("domain", email);
//   if (!email) return 'default';
//   const match = email.match(/@([^.]+)/);
//   return match ? match[1].toLowerCase() : 'default';
// }

export function getBankSpecificLogo(domain) {
  const bankMapping = {
    'bsi': 'bsi',
    'bankbsi': 'bsi',
    'bsisyariah': 'bsi',
    
    'jamkrinda': 'jamkrinda',
    'bankjamkrinda': 'jamkrinda',
    'bjk': 'jamkrinda',
    
    'bankdki': 'bankjakarta',
    'dki': 'bankjakarta',
    'bankjakarta': 'bankjakarta',
    'bjb': 'bankjakarta'
  };
  
  return bankMapping[domain.toLowerCase()] || 'default';
}

export function getMitra(domain) {
  const mitraMapping = {
    'bsi': 'PT Bank Syariah Indonesia Tbk',
    'jamkrinda': 'Jamkrida Jakarta',
    'bankjakarta': 'PT Bank DKI'
  }

  return mitraMapping[domain.toLowerCase()] || 'Jamkrida Jakarta'
}

export function getEntitas(domain) {
  const EntitasMapping = {
    'bsi': 'BSI',
    'jamkrinda': 'BJK',
    'bankjakarta': 'DKI'
  }

  return EntitasMapping[domain.toLowerCase()] || 'BJK'
}

export function getLogoPath(mitra_id) {
  const lowerCaseMitra = mitra_id.toLowerCase();
  const specificBank = getBankSpecificLogo(lowerCaseMitra);
  return LOGOS[specificBank] || LOGOS[mitra_id] || LOGOS['default'];
}

export function getMitraName(mitra_id) {
  const lowerCaseMitra = mitra_id.toLowerCase();

  const specificBank = getBankSpecificLogo(lowerCaseMitra);
  const mitraName = getMitra(specificBank);

  return mitraName;
}

export function getEntitasName(mitra_id) {
  const lowerCaseMitra = mitra_id.toLowerCase();
  const specificBank = getBankSpecificLogo(lowerCaseMitra);
  const entitasName = getEntitas(specificBank);

  return entitasName;
}
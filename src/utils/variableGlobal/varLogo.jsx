import jamkrindsaLogo from 'src/assets/image/logo-jamkrida-jkt.png';
import bsiLogo from 'src/assets/image/logo-bank-bsi.png';
import bankjakartaLogo from 'src/assets/image/logo-bankdki.png';
import defaultLogo from "src/assets/image/logo-jamkrida-jkt.png";

export const BANK_LOGOS = {
  bsi: {
    logo: bsiLogo,
    name: 'Bank BSI',
    aliases: ['bsi', 'bankbsi', 'bsisyariah']
  },
  jamkrinda: {
    logo: jamkrindsaLogo,
    name: 'Bank Jamkrinda',
    aliases: ['jamkrinda', 'bankjamkrinda', 'bjk']
  },
  bankjakarta: {
    logo: bankjakartaLogo,
    name: 'Bank Jakarta',
    aliases: ['bankdki', 'dki', 'bankjakarta', 'bjb']
  },
  default: {
    logo: defaultLogo,
    name: 'Default Bank',
    aliases: []
  }
};

export const LOGOS = Object.fromEntries(
  Object.entries(BANK_LOGOS).map(([key, value]) => [key, value.logo])
);
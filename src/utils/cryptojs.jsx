import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_CHARACTER_HEX_ENC;

// Fungsi untuk mengenkripsi data
export const encryptData = (data) => {
  // console.log(ENCRYPTION_KEY);
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// Fungsi untuk mendekripsi data
export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Fungsi untuk menyimpan data di localStorage
export const saveToLocalStorage = (key, data) => {
  const encryptedData = encryptData(data);
  localStorage.setItem(`${key}`, encryptedData);
};

// Fungsi untuk mengambil data dari localStorage
// export const getFromLocalStorage = (key) => {
//   const encryptedData = localStorage.getItem(`${key}`);
//   if (encryptedData) {
//     return decryptData(encryptedData);
//   }
//   return null;
// };

export const getFromLocalStorage = key => {
  return localStorage.getItem(key);
};

// Fungsi untuk menghapus data dari localStorage
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(`${key}`);
};

import moment from "moment";

/**
 * Convert image URL to a File object.
 * @param {string} imageUrl - The URL of the image.
 * @param {string} fileName - The desired file name.
 * @returns {Promise<File>} - A promise that resolves to a File object.
 */
export const convertImageUrlToFile = async (imageUrl, fileName) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

  // Helper function to truncate long strings
export const truncateString = (str, maxLength = 30) => {
  if (str && str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
};

/**
 * Format a given number to a string with Indonesian locale.
 * If the given number is not a number, null or undefined, it will return "0".
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export const formatNumber = (value) => {
  if(!value) return value
  if (isNaN(value) || value === null || value === undefined) return "0";
  
  return parseInt(value, 10).toLocaleString("id-ID");
};

// Helper function untuk memformat angka dengan separator ribuan titik
export const formatNumberWithThousandSeparator = (value) => {
  // Menghapus semua karakter non-angka dan mengonversi kembali menjadi angka
  const numericValue = value?.toString().replace(/[^0-9]/g, ""); // Hapus semua huruf dan karakter selain angka
    
  // Jika numericValue kosong atau tidak valid, kembalikan string kosong atau angka 0
  if (numericValue === "") {
    return "";
  }

  // Format angka dengan separator titik ribuan
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper function untuk menghapus separator ribuan (titik) dari angka
export const removeThousandSeparator = (value) => {
  // Menghapus semua titik sebagai separator ribuan
  return value?.replace(/\./g, "");
};

export const formatDateTime = (date, format = "DD MMM YYYY HH:mm") => date ? moment(date).format(format) : "-";

export const isNullOrEmptyString = (value) => !value || value.trim() === '';

export const asyncConvertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => {
      console.error("Error:", error);
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}

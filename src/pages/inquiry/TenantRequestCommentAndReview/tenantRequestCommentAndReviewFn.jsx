export function validateAndBuildReviewPayload(data) {
  const errors = [];

  if (!data.ORDER_ID) errors.push("ORDER_ID wajib diisi.");
  if (!data.RATED || data.RATED <= 0) errors.push("Rating harus lebih dari 0.");

  // Validasi berdasarkan 'type'
  if (data.TYPE === "product") {
    if (!data.PRODUCT_ID) errors.push("PRODUCT_ID harus diisi karena type adalah 'product'.");
  } else if (data.TYPE === "package") {
    if (!data.PRODUCT_ID) errors.push("PACKAGE_ID harus diisi karena type adalah 'package'.");
  } else {
    errors.push("Type harus 'product' atau 'package'.");
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors
    };
  }

  return {
    success: true
  };
}
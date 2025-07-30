export const formatDateToDDMMYYYY = dateString => {
	if (!dateString) return "-";

	// Jika sudah dalam format DD/MM/YYYY
	if (typeof dateString === "string" && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
		return dateString;
	}

	// Jika berupa Date object
	if (dateString instanceof Date) {
		const day = String(dateString.getDate()).padStart(2, "0");
		const month = String(dateString.getMonth() + 1).padStart(2, "0");
		const year = dateString.getFullYear();
		return `${day}/${month}/${year}`;
	}

	// Jika format lain (MM/DD/YYYY atau YYYY-MM-DD)
	try {
		const dateObj = new Date(dateString);
		if (isNaN(dateObj.getTime())) {
			throw new Error("Invalid date");
		}
		const day = String(dateObj.getDate()).padStart(2, "0");
		const month = String(dateObj.getMonth() + 1).padStart(2, "0");
		const year = dateObj.getFullYear();
		return `${day}/${month}/${year}`;
	} catch {
		return dateString; // Return as-is jika tidak bisa diformat
	}
};

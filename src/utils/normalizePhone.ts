export default function normalizePhone(phone: string): string {
	const digits = phone.replace(/\D/g, "");

	if (digits.startsWith("0")) {
		return `+33${digits.substring(1)}`;
	}

	return `+${digits}`;
}

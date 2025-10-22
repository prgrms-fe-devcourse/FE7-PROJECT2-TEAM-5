export function timeAgoIntl(dateString: string | Date) {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();

	const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

	const seconds = Math.floor(diffMs / 1000);
	if (seconds < 60) return rtf.format(-seconds, "seconds");

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return rtf.format(-minutes, "minutes");

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return rtf.format(-hours, "hours");

	const days = Math.floor(hours / 24);
	return rtf.format(-days, "days");
}

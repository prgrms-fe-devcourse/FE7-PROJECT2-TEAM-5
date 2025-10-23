export function decodeHtmlEntities(str: string) {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = str;
	return textarea.value;
}

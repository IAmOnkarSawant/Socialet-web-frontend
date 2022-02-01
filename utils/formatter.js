export const removeLinkFromText = (string) => {
	return string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
};

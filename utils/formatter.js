export const removeLinkFromText = (string) => {
	return string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
};

function getHashtags(searchText) {
	const regexp = /(?:^|\W)#(\w+)(?!\w)/g;
	const result = searchText.match(regexp);
	if (result) return result;
	return [];
}

export const tweetFormatter = (tweet_full_text, tweet_obj) => {
	const hashtags = getHashtags(tweet_full_text);
	let tweet = tweet_full_text;
	hashtags.map(
		(hashtag) =>
			(tweet = tweet.replace(
				hashtag,
				`<span style="cursor: pointer;color: rgb(17, 109, 170);pointer-events: all" class="font-weight-bold">${hashtag}</span>`
			))
	);
	return hashtags.length > 0
		? removeLinkFromText(tweet)
		: removeLinkFromText(tweet_full_text);
};

import twttr from 'twitter-text';

export const removeLinkFromText = (string) => {
	return string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
};

function getHashtags(searchText) {
	return twttr.extractHashtags(searchText).map((tag)=>("#"+tag))
}

export const tweetFormatter = (tweet_full_text) => {
	const hashtags = getHashtags(tweet_full_text);
	let tweet = tweet_full_text;
	if(hashtags.length!==0){
		hashtags.map(
			(hashtag) =>
				(tweet = tweet.replace(
					hashtag,
					`<span style="cursor: pointer;color: rgb(17, 109, 170);pointer-events: all" class="font-weight-bold">${hashtag}</span>`
				))
		);
	}

	return tweet;
};

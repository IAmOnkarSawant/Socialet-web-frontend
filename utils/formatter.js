import twttr from 'twitter-text';

export const removeLinkFromText = (string) => {
	return string.replace(/https:\/\/t.co\/[a-zA-Z0-9\-\.]+/g, "");
};

function getHashtags(searchText) {
	return twttr.extractHashtags(searchText).map((tag)=>("#"+tag))
}


const handleURL = (tweet,tweet_obj) =>{
	const allURL = twttr.extractUrls(tweet)
	const entities = tweet_obj.entities;
	const nonMediaURL = allURL.map((url)=>{ 
		if(!entities.urls.includes(url)){
			return entities.urls
		}
	})

	const flattened = nonMediaURL.flat()

	flattened.forEach((el)=>{
		if(String(tweet).includes(el.url)){
			tweet = tweet.replace(
				el.url,
				twttr.autoLinkUrlsCustom(el.expanded_url,{
					urlEntities:{
						"url": el.url,
						"display_url": el.display_url,
						"expanded_url": el.expanded_url,
					},
					targetBlank:true,
				})
			)
		}
	})

	return tweet;
}

export const tweetFormatter = (tweet_full_text,tweet_obj) => {

	// handling hashtags
	const hashtags = getHashtags(tweet_full_text);
	let tweet = tweet_full_text;
	if(hashtags.length!==0){
		hashtags.map(
			(hashtag) =>
				(tweet = tweet.replace(
					hashtag || `<span>${hashtag}</span>`,
					`<span style="cursor: pointer;color: rgb(17, 109, 170);pointer-events: all" class="font-weight-bold">${hashtag}</span>`
				))
		);
	}

	// handling URLs (non-media)
	const linkyfied=handleURL(tweet,tweet_obj);

	// remove media links
	const formattedTweet=removeLinkFromText(linkyfied)

	return formattedTweet;
};

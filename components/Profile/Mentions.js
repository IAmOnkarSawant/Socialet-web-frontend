import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { emotionRecogniser } from "../../_api/emotions";
import { getUserMentions } from "../../_api/profile";
import NotFound from "../Pages/NotFound";
import TwitterFeedCard from "../Post/TwitterFeedCard";

function Mentions({ user_id, screen_name, tab, ...props }) {
  const [mentions, setMentions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFoundShow, setIsFoundShow] = useState(false);
  const [isNewPostAvailable, setIsNewPostAvailable] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user_id && (screen_name || !screen_name) && tab === "2") {
      getUserMentions(user_id, screen_name, page)
        .then(({ data }) => {
          if (screen_name) {
            setMentions((prevResults) => [
              ...removeDuplicatesFromArrayOfObjects(
                [...prevResults, ...data?.searched_tweets],
                "id"
              ),
            ]);
            setHasMore(data?.searched_tweets.length > 0);
            setIsFoundShow(!data?.searched_tweets.length && page === 1);
            setIsNewPostAvailable(data?.searched_tweets.length > 0);
          } else {
            setMentions((prevMentions) => [
              ...removeDuplicatesFromArrayOfObjects(
                [...prevMentions, ...data?.mentions],
                "id"
              ),
            ]);
            setHasMore(data?.mentions.length > 0);
            setIsNewPostAvailable(data?.mentions.length > 0);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user_id, screen_name, tab, page]);

  const recogniseTweetEmotion = () => {
    const tweets = mentions.map((f) => ({
      tweet: f.full_text,
      id: f.id,
    }));
    emotionRecogniser({ tweets }).then(({ data }) => {
      console.log(data.tweets);
      const resp = mentions.map((tweet) => {
        const emoji = [...data.tweets].find((t) => {
          if (t.id === tweet.id) {
            return t;
          }
        });
        console.log(emoji["emotion"]);

        return {
          ...tweet,
          emotion: emoji["emotion"],
        };
      });
      console.log(resp);
      setMentions((previousFeed) => [...resp]);
    });
  };

  useEffect(() => {
    if (isNewPostAvailable && page) {
      recogniseTweetEmotion();
      setIsNewPostAvailable(false);
    }
  }, [isNewPostAvailable, page]);

  if (!!isFoundShow) {
    return <NotFound property="user mentions" />;
  }

  return (
    <div>
      {mentions.map((mention, index) => (
        <TwitterFeedCard isEmotionShow tweet={mention} key={index} />
      ))}
      {mentions.length !== 0 && !loading && (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => setPage((page) => page + 1)}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          Load More...
        </p>
      )}
      {mentions.length !== 0 && loading && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          <Spinner size="sm" color="default" />
        </p>
      )}
      {mentions.length !== 0 && !loading && !hasMore && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          No More Mentions
        </p>
      )}
    </div>
  );
}

export default React.memo(Mentions);

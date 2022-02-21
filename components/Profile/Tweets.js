import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { getUserTimeline } from "../../_api/profile";
import TwitterFeedCard from "../Post/TwitterFeedCard";

function Tweets({ user_id, screen_name, tab, ...props }) {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user_id && (screen_name || !screen_name) && tab === "1") {
      getUserTimeline(user_id, screen_name, page)
        .then(({ data: { posts } }) => {
          console.log(posts);
          const newTweets = removeDuplicatesFromArrayOfObjects(
            [...tweets, ...posts],
            "id"
          );
          setTweets([...newTweets]);
          setHasMore(posts.length > 0);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user_id, screen_name, tab, page]);

  return (
    <div>
      {tweets.map((tweet, index) => {
        return <TwitterFeedCard key={index} tweet={tweet} />;
      })}
      {tweets.length !== 0 && !loading && (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => setPage((page) => page + 1)}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          Load More...
        </p>
      )}
      {tweets.length !== 0 && loading && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          <Spinner size="sm" color="default" />
        </p>
      )}
      {tweets.length !== 0 && !loading && !hasMore && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          No More Tweets
        </p>
      )}
    </div>
  );
}

export default React.memo(Tweets);

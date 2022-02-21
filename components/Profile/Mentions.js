import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { getUserMentions } from "../../_api/profile";
import NotFound from "../Pages/NotFound";
import TwitterFeedCard from "../Post/TwitterFeedCard";

function Mentions({ user_id, screen_name, tab, ...props }) {
  const [mentions, setMentions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFoundShow, setIsFoundShow] = useState(false);

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
          } else {
            setMentions((prevMentions) => [
              ...removeDuplicatesFromArrayOfObjects(
                [...prevMentions, ...data?.mentions],
                "id"
              ),
            ]);
            setHasMore(data?.mentions.length > 0);
            setIsFoundShow(!data?.mentions.length && page === 1);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user_id, screen_name, tab, page]);

  if (!!isFoundShow) {
    return <NotFound property="user mentions" />;
  }

  return (
    <div>
      {mentions.map((mention, index) => (
        <TwitterFeedCard tweet={mention} key={index} />
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

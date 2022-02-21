import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { getUserFollowers } from "../../_api/profile";
import NotFound from "../Pages/NotFound";
import Follow from "./Card/Follow";

function Followers({ user_id, screen_name, tab, ...props }) {
  const [followers, setFollowers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFoundShow, setIsFoundShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user_id && (screen_name || !screen_name) && tab === "3") {
      getUserFollowers(user_id, screen_name, page)
        .then(({ data: { followers } }) => {
          setFollowers((prevFollowers) => [
            ...removeDuplicatesFromArrayOfObjects(
              [...prevFollowers, ...followers],
              "id"
            ),
          ]);
          setHasMore(followers.length > 0);
          setLoading(false);
          setIsFoundShow(!followers.length && page === 1);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user_id, screen_name, tab, page]);

  if (!!isFoundShow) {
    return <NotFound property="followers" />;
  }

  return (
    <div>
      {followers.map((follower, index) => (
        <Follow follower={follower} key={index} />
      ))}
      {followers.length !== 0 && !loading && (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => setPage((page) => page + 1)}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          Load More...
        </p>
      )}
      {followers.length !== 0 && loading && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          <Spinner size="sm" color="default" />
        </p>
      )}
      {followers.length !== 0 && !loading && !hasMore && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          No More Followers
        </p>
      )}
    </div>
  );
}

export default React.memo(Followers);

import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { getUserFollowing } from "../../_api/profile";
import Friend from "./Card/Friend";

function Following({ user_id, screen_name, tab, ...props }) {
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user_id && (screen_name || !screen_name) && tab === "4") {
      getUserFollowing(user_id, screen_name, page)
        .then(({ data: { following } }) => {
          setFollowing((prevFollwings) => [
            ...removeDuplicatesFromArrayOfObjects(
              [...prevFollwings, ...following],
              "id"
            ),
          ]);
          setHasMore(following.length > 0);
          setLoading(false);
          console.log(following);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user_id, screen_name, tab, page]);

  return (
    <div>
      {following.map((friend, index) => (
        <Friend following={friend} key={index} />
      ))}
      {following.length !== 0 && !loading && (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => setPage((page) => page + 1)}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          Load More...
        </p>
      )}
      {following.length !== 0 && loading && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          <Spinner size="sm" color="default" />
        </p>
      )}
      {following.length !== 0 && !loading && !hasMore && (
        <p
          style={{ cursor: "pointer" }}
          className="rounded bg-light border border-secondary h5 mb-0 d-block text-center py-2 text-default"
        >
          No More Followings
        </p>
      )}
    </div>
  );
}

export default React.memo(Following);

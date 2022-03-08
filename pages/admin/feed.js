import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, NavbarBrand } from "reactstrap";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getTwitterFeed } from "../../_api/twitter";
import TwitterCard from "../../components/Post/TwitterFeedCard";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import CenterSpinner from "../../components/Loaders/CenterSpinner";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { emotionRecogniser } from "../../_api/emotions";

function Feed() {
  const router = useRouter();
  const { data: session } = useSession();

  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  const [feed, setFeed] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostAvailable, setIsNewPostAvailable] = useState(false);

  const recogniseTweetEmotion = () => {
    const tweets = feed.map((f) => ({
      tweet: f.full_text,
      id: f.id,
    }));
    emotionRecogniser({ tweets }).then(({ data }) => {
      console.log(data.tweets);
      const resp = feed.map((tweet) => {
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
      setFeed((previousFeed) => [...resp]);
    });
  };

  useEffect(() => {
    if (isNewPostAvailable) {
      recogniseTweetEmotion();
      setIsNewPostAvailable(false);
    }
  }, [isNewPostAvailable]);

  useEffect(() => {
    if (inView && hasMore) setPage((page) => page + 1);
  }, [inView]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    let isMounted = true;
    setIsLoading(true);
    getTwitterFeed(session.token.sub, page, { cancelToken: source.token })
      .then(({ data }) => {
        console.log(data);
        if (isMounted) {
          setFeed((prevFeed) => [
            ...removeDuplicatesFromArrayOfObjects(
              [...prevFeed, ...data.feed],
              "id"
            ),
          ]);
          setHasMore(data.feed.length > 0);
          setIsLoading(false);
          setIsNewPostAvailable(data.feed.length > 0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (axios.isCancel(err)) console.log(err);
        else console.log(err);
      });
    return () => {
      isMounted = false;
      source.cancel();
    };
  }, [page]);

  return (
    <React.Fragment>
      <Navbar color="white" light expand="md">
        <NavbarBrand className="pl-4 font-weight-bold">
          Twitter feed
        </NavbarBrand>
        <Button
          color="primary"
          className="mb-3 px-4"
          outline
          style={{ marginLeft: "auto", marginRight: 15 }}
          size="sm"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Navbar>
      <Container className="mt-4" fluid="sm">
        {feed.length !== 0 &&
          feed.map((tweet, index) => {
            if (index === feed.length - 1) {
              return (
                <TwitterCard
                  ref={ref}
                  key={tweet.id}
                  tweet={tweet}
                  feed={true}
                  isEmotionShow
                />
              );
            }
            return (
              <TwitterCard
                isEmotionShow
                key={tweet.id}
                tweet={tweet}
                feed={true}
              />
            );
          })}
        {isLoading && hasMore && (
          <CenterSpinner
            style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
            type="border"
            size="md"
            color="default"
          />
        )}
      </Container>
    </React.Fragment>
  );
}

Feed.requireAuth = true;

export default Feed;

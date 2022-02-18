import React, { useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { BiPin } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { RiReplyLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import moment from "moment";
import millify from "millify";
import { tweetFormatter } from "../../utils/formatter";
import ModalImage from "../Modal/ModalImage";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { postFavorites, postReTweet } from "../../_api/twitter";
import toast from "react-hot-toast";

function TwitterSearchCard(
  { tweet, search, feed, callback, setPage, ...props },
  ref
) {
  const [modalImageURL, setModalImageURL] = useState("");
  const [tweetData, setTweetData] = useState(tweet);
  const { data: session } = useSession();
  const tweet_text =
    tweet?.retweet_count === 0
      ? tweet.full_text
      : tweet.retweeted_status
      ? tweet.retweeted_status.full_text
      : tweet.full_text;

  const favTweetHandler = (e) => {
    // already favorited-> to be unfavorited
    if (tweetData.favorited) {
      setTweetData({
        ...tweetData,
        favorited: false,
      });
      const bodyData = {
        tweet_id: tweet.id_str,
        user_id: session.token.sub,
        favorite: "False",
      };
      postFavorites(bodyData).then(({ data }) => {
        // show success/error message in popup later
        console.log(data);
      });
      return;
    }
    // if not favorited
    setTweetData({
      ...tweetData,
      favorited: true,
    });
    const bodyData = {
      tweet_id: tweet.id_str,
      user_id: session.token.sub,
      favorite: "True",
    };
    postFavorites(bodyData).then(({ data }) => {
      // show success/error message in popup later
      console.log(data);
    });
  };

  const reTweetHandler = (e) => {
    if (tweetData.retweeted) {
      setTweetData({
        ...tweetData,
        retweeted: false,
      });
      const bodyData = {
        tweet_id: tweet.id_str,
        user_id: session.token.sub,
        retweet: "False",
      };
      postReTweet(bodyData).then(({ data }) => {
        // show success/error message in popup later
        console.log(data);
      });
      return;
    }
    setTweetData({
      ...tweetData,
      retweeted: true,
    });
    const bodyData = {
      tweet_id: tweet.id_str,
      user_id: session.token.sub,
      retweet: "True",
    };
    postReTweet(bodyData).then(({ data }) => {
      toast.success(data?.message);
      console.log(data);
    });
  };

  const router = useRouter();

  const replyTweetHandler = (e) => {
    router.push({
      pathname: "/admin/publish",
      query: {
        replyTo: tweet.id_str,
      },
    });
  };
  const clickHandler = (e) => {
    let el = e.target;

    if (el.parentNode.tagName !== "SPAN") {
      e.preventDefault();
      return;
    }
    if (el && el.tagName === "SPAN" && el.innerText.trim().startsWith("#")) {
      props.formik.setFieldValue("searchTerm", el.innerText.trim());
      setPage(1);
      callback();
    }
  };

  if (!ref) {
    return (
      <section ref={ref} className="mb-4 rounded bg-white shadow-lg">
        <div className="d-flex flex-row align-items-center justify-content-between px-3 py-3">
          <div
            className="d-flex flex-row align-items-center"
            style={{ color: "rgb(54, 65, 65)" }}
          >
            <img
              style={{ width: "35px", height: "35px" }}
              className="mr-2 rounded-circle"
              src={tweet.user.profile_image_url}
            />
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center">
                <BsTwitter
                  style={{ fontSize: "14px", color: "rgb(29, 161, 242)" }}
                  className="mr-1"
                />
                <span
                  style={{ fontSize: "13px" }}
                  className="mr-1 font-weight-bolder"
                >
                  {tweet.user.name}
                </span>
                <span style={{ fontSize: "13px" }} className="mr-2">
                  @{tweet.user.screen_name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: "rgb(255, 198, 164)",
                  }}
                  className="mr-2 px-3 py-0 rounded-pill"
                >
                  {millify(tweet.user.followers_count)}
                </span>
              </div>
              {search && (
                <div>
                  <span style={{ fontSize: "12px" }}>
                    {tweet.retweet_count === 0 ? "Tweet" : "Retweeted"}
                  </span>
                  {tweet.retweet_count !== 0 && (
                    <AiOutlineRetweet
                      style={{
                        fontSize: 15,
                      }}
                      className="ml-2"
                    />
                  )}
                  <span
                    className="text-dark font-weight-bold ml-2"
                    style={{ fontSize: "12px" }}
                  >
                    {tweet.retweet_count !== 0 && (
                      <span className="text-dark font-weight-normal">
                        {"by  "}
                      </span>
                    )}
                    {tweet.retweet_count !== 0 &&
                      tweet?.retweeted_status?.user?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="pr-3">
            <span style={{ fontSize: "13px" }}>
              {moment(new Date(tweet.created_at)).startOf("day").fromNow()}
            </span>
          </div>
        </div>
        <hr className="mt-0 mb-1" />
        <div
          style={{
            margin: "10px 60px",
          }}
          className={`${
            tweet.retweet_count === 0 ? "" : "border border-black p-3 rounded"
          } my-3`}
        >
          <span
            style={{
              fontSize: tweet.retweet_count === 0 ? "15px" : "13px",
              color: "#364141",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{
              __html: tweetFormatter(tweet_text, tweet),
            }}
            onClick={clickHandler}
          />
          <div className="d-flex flex-row align-items-center mt-2">
            {tweet?.entities?.media?.map(
              (media) =>
                media.type == "photo" && (
                  <div key={media.id} style={{ cursor: "pointer" }}>
                    <img
                      className="shadow-lg bg-white rounded-lg"
                      width="140px"
                      src={media.media_url_https}
                      alt={media.display_url}
                      onClick={() => setModalImageURL(media?.media_url_https)}
                    />
                  </div>
                )
            )}
          </div>
        </div>
        <div className="d-flex flex-row justify-content-end align-items-center p-3">
          <div>
            {tweetData.favorited ? (
              <AiTwotoneHeart
                style={{
                  marginLeft: "auto",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "red",
                }}
                className="ml-4"
                onClick={favTweetHandler}
              />
            ) : (
              <AiOutlineHeart
                style={{
                  marginLeft: "auto",
                  fontSize: 20,
                  cursor: "pointer",
                }}
                className="ml-4"
                onClick={favTweetHandler}
              />
            )}
            <AiOutlineRetweet
              style={{
                marginLeft: "auto",
                fontSize: 20,
                cursor: "pointer",
                color: tweetData.retweeted ? "#5e72e4" : "",
              }}
              className="ml-4"
              onClick={reTweetHandler}
            />
            <BiPin
              style={{
                marginLeft: "auto",
                fontSize: 20,
                cursor: "pointer",
              }}
              className="ml-4"
            />
            <RiReplyLine
              style={{
                marginLeft: "auto",
                fontSize: 20,
                cursor: "pointer",
              }}
              className="ml-4"
              onClick={replyTweetHandler}
            />
          </div>
        </div>
        {modalImageURL && (
          <ModalImage setModalImageURL={setModalImageURL} url={modalImageURL} />
        )}
      </section>
    );
  }

  return (
    <section ref={ref} className="mb-4 rounded bg-white shadow-lg">
      <div className="d-flex flex-row align-items-center justify-content-between px-3 py-3">
        <div
          className="d-flex flex-row align-items-center"
          style={{ color: "rgb(54, 65, 65)" }}
        >
          <img
            style={{
              width: "35px",
              height: "35px",
            }}
            className="mr-2 rounded-circle"
            src={tweet.user.profile_image_url}
          />
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center">
              <BsTwitter
                style={{
                  fontSize: "14px",
                  color: "rgb(29, 161, 242)",
                }}
                className="mr-1"
              />
              <span
                style={{ fontSize: "13px" }}
                className="mr-1 font-weight-bolder"
              >
                {" "}
                {tweet.user.name}{" "}
              </span>
              <span style={{ fontSize: "13px" }} className="mr-2">
                @{tweet.user.screen_name}{" "}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  backgroundColor: "rgb(255, 198, 164)",
                }}
                className="mr-2 px-3 py-0 rounded-pill"
              >
                {" "}
                {millify(tweet.user.followers_count)}{" "}
              </span>
            </div>
            {search && (
              <span style={{ fontSize: "12px" }}>
                {" "}
                {tweet.retweet_count === 0 ? "Tweet" : "Retweeted"}{" "}
              </span>
            )}
            {feed && <span style={{ fontSize: "12px" }}>Tweet</span>}{" "}
          </div>
        </div>
        <div className="pr-3">
          <span style={{ fontSize: "13px" }}>
            {" "}
            {moment(new Date(tweet.created_at)).startOf("day").fromNow()}{" "}
          </span>
        </div>
      </div>
      <hr className="mt-0 mb-1" />
      <div style={{ paddingLeft: "53px" }} className="pr-3 py-3">
        <span
          style={{
            fontSize: "15px",
            color: "#364141",
            whiteSpace: "pre-line",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{
            __html: tweetFormatter(tweet_text, tweet),
          }}
          onClick={clickHandler}
        />
      </div>
      <div
        style={{ paddingLeft: "53px" }}
        className="d-flex flex-row align-items-center"
      >
        {" "}
        {tweet.retweet_count === 0
          ? tweet?.entities?.media?.map(
              (media) =>
                media.type == "photo" && (
                  <div key={media.id} style={{ cursor: "pointer" }}>
                    <img
                      className="shadow-lg bg-white rounded-lg"
                      width="140px"
                      src={media.media_url_https}
                      alt={media.display_url}
                      onClick={() => setModalImageURL(media?.media_url_https)}
                    />
                  </div>
                )
            )
          : tweet?.retweeted_status?.entities.media?.map(
              (media) =>
                media?.type == "photo" && (
                  <div key={media.id} style={{ cursor: "pointer" }}>
                    <img
                      className="shadow-lg bg-white rounded-lg"
                      width="140px"
                      src={media.media_url_https}
                      alt={media.display_url}
                      onClick={() => setModalImageURL(media?.media_url_https)}
                    />
                  </div>
                )
            )}{" "}
      </div>
      <div className="d-flex flex-row justify-content-end align-items-center p-3">
        <div>
          {" "}
          {tweetData.favorited ? (
            <AiTwotoneHeart
              style={{
                marginLeft: "auto",
                fontSize: 20,
                cursor: "pointer",
                color: "red",
              }}
              className="ml-4"
              onClick={favTweetHandler}
            />
          ) : (
            <AiOutlineHeart
              style={{
                marginLeft: "auto",
                fontSize: 20,
                cursor: "pointer",
              }}
              className="ml-4"
              onClick={favTweetHandler}
            />
          )}
          <AiOutlineRetweet
            style={{
              marginLeft: "auto",
              fontSize: 20,
              cursor: "pointer",
              color: tweetData.retweeted ? "#5e72e4" : "",
            }}
            className="ml-4"
            onClick={reTweetHandler}
          />
          <BiPin
            style={{
              marginLeft: "auto",
              fontSize: 20,
              cursor: "pointer",
            }}
            className="ml-4"
          />
          <RiReplyLine
            style={{
              marginLeft: "auto",
              fontSize: 20,
              cursor: "pointer",
            }}
            className="ml-4"
            onClick={replyTweetHandler}
          />
        </div>
      </div>
      {modalImageURL && (
        <ModalImage setModalImageURL={setModalImageURL} url={modalImageURL} />
      )}{" "}
    </section>
  );
}

export default React.forwardRef(TwitterSearchCard);

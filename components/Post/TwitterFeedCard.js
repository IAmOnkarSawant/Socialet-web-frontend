import React, { useEffect, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { RiReplyLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import moment from "moment";
import millify from "millify";
import ModalImage from "../Modal/ModalImage";
import { tweetFormatter } from "../../utils/formatter";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { postFavorites, postReTweet } from "../../_api/twitter";
import { emotions } from "../../utils/emotion";
import { Spinner } from "reactstrap";
import { languagesList } from "../../utils/HelperData";
import { postTranslatedText } from "../../_api/emotions";
// const translate = require("google-translate-api");

function TwitterFeedCard(
  {
    tweet,
    search,
    feed,
    formik,
    isEmotionShow = false,
    isLikeShow = false,
    isRetweetShow = false,
    isReplyShow = false,
    ...props
  },
  ref
) {
  console.log(ref);
  const [modalImageURL, setModalImageURL] = useState("");
  const { data: session } = useSession();
  const [tweetData, setTweetData] = useState(tweet);
  const tweet_text =
    tweet?.retweet_count === 0
      ? tweet.full_text
      : tweet.retweeted_status
      ? tweet.retweeted_status.full_text
      : tweet.full_text;

  const [translatedTweet, setTranslatedTweet] = useState({
    id: null,
    tweet: "",
  });

  const translateText = (id, inputText, language) => {
    console.log(inputText, language);
    postTranslatedText({ text: inputText, language }).then(({ data }) => {
      setTranslatedTweet({ id, tweet: data.translated });
    });
  };

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
      console.log(data);
    });
  };

  const reTweetHandler = (e) => {
    if (tweetData.retweeted) {
      // un retweeting
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
        console.log(data.message);
      });
      return;
    }
    // retweeting
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
      console.log(data);
    });
  };

  const replyTweetHandler = (e) => {
    router.push({
      pathname: "/admin/publish",
      query: {
        replyTo: tweet.id_str,
      },
    });
  };

  const router = useRouter();

  const clickHandler = (e) => {
    let el = e.target;
    console.log(el.parentNode);

    if (el.parentNode.tagName !== "SPAN") {
      e.preventDefault();
      return;
    }

    // handling hashtag
    if (
      el &&
      el.getAttribute("type") === "#hashtag" &&
      el.innerText.trim().startsWith("#")
    ) {
      router.push({
        pathname: "/admin/search",
        query: {
          searchTerm: el.innerText.trim().replace("#", "hashtag"),
        },
      });
    }

    // handling userMention
    if (
      el &&
      el.getAttribute("type") === "usermention" &&
      el.innerText.trim().startsWith("@")
    ) {
      router.push({
        pathname: "/admin/userprofile",
        query: {
          username: el.innerText.trim().replace("@", ""),
        },
      });
    }
  };

  return (
    <section ref={ref} className="mb-4 rounded bg-white shadow-lg">
      <div className="d-flex flex-row align-items-center justify-content-between px-3 py-3">
        <div
          className="d-flex flex-row align-items-center"
          style={{ color: "rgb(54, 65, 65)" }}
        >
          <img
            style={{ width: "35px", height: "35px" }}
            className="mr-2 rounded-circle shadow-lg"
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
              {Number(tweet.user.followers_count) > 10 && (
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: "rgb(255, 198, 164)",
                  }}
                  className="mr-2 px-3 py-0 rounded-pill"
                >
                  {millify(tweet.user.followers_count)}
                </span>
              )}
            </div>
            {search && (
              <span style={{ fontSize: "12px" }}>
                {tweet.retweet_count === 0 ? "Tweet" : "Retweeted"}
              </span>
            )}
            {feed && <span style={{ fontSize: "12px" }}>Tweet</span>}
          </div>
        </div>
        <div className="pr-3">
          <span style={{ fontSize: "13px" }}>
            {moment(new Date(tweet.created_at)).startOf("second").fromNow()}
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
            __html: translatedTweet?.tweet
              ? translatedTweet?.tweet === "language not supported!"
                ? tweetFormatter(tweet_text, tweet)
                : translatedTweet?.tweet
              : tweetFormatter(tweet_text, tweet),
          }}
          onClick={clickHandler}
        />
      </div>
      <div
        style={{ paddingLeft: "53px" }}
        className="d-flex flex-row align-items-center"
      >
        {tweet?.entities?.media?.map(
          (media) =>
            media.type == "photo" && (
              <div key={media.id} style={{ cursor: "pointer" }}>
                <img
                  className="shadow-lg bg-white rounded-lg mr-2"
                  width="140px"
                  src={media.media_url_https}
                  alt={media.display_url}
                  onClick={() => setModalImageURL(media?.media_url_https)}
                />
              </div>
            )
        )}
      </div>
      <div className="d-flex flex-row justify-content-end align-items-center p-3">
        <select
          onChange={(e) =>
            translateText(tweet?.id, tweet?.full_text, e.target.value)
          }
          style={{ marginLeft: 36 }}
        >
          <option disabled value="">
            Select Language
          </option>
          {Object.entries(languagesList).map(([key, value], index) => {
            return (
              <option key={key} value={key}>
                {value}
              </option>
            );
          })}
        </select>
        {isEmotionShow && tweet["emotion"] ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 21,
            }}
          >
            {emotions[tweet["emotion"]]}
          </span>
        ) : (
          isEmotionShow &&
          !tweet["emotion"] && <Spinner type="grow" color="default" size="sm" />
        )}
        {isLikeShow &&
          (tweetData.favorited ? (
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
          ))}
        {isRetweetShow && tweetData.retweeted && (
          <FaRetweet
            style={{
              marginLeft: "auto",
              fontSize: 20,
              cursor: "pointer",
              color: tweetData.retweeted ? "#5e72e4" : "",
            }}
            className="ml-4"
            onClick={reTweetHandler}
          />
        )}
        {isReplyShow && (
          <RiReplyLine
            style={{
              marginLeft: "auto",
              fontSize: 20,
              cursor: "pointer",
            }}
            className="ml-4"
            onClick={replyTweetHandler}
          />
        )}
      </div>
      {modalImageURL && (
        <ModalImage setModalImageURL={setModalImageURL} url={modalImageURL} />
      )}
    </section>
  );
}

export default React.forwardRef(TwitterFeedCard);

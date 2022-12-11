import React, { useEffect, useState } from "react";
import MediaUnitsHeader from "components/Headers/MediaUnintsHeader.js";
import Admin from "layouts/Admin.js";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { emotionRecogniser } from "../../_api/emotions";
import {
  getTrendingHashtags,
  getTrendingTopics,
  getWeeklyTweets,
} from "../../_api/twitter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import TwitterCard from "../../components/Post/TwitterFeedCard";
import CenterSpinner from "../../components/Loaders/CenterSpinner";
import { countryList } from "../../utils/HelperData";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

function management() {
  const router = useRouter();
  const { data: session } = useSession();
  const [feed, setFeed] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [openMediaUnit, setOpenMediaUnit] = useState(false);
  const [country, setCountry] = useState("");
  const [topics, setTopics] = useState([]);

  const recogniseTweetEmotion = () => {
    const tweets = feed.map((f) => ({
      tweet: f.full_text,
      id: f.id,
    }));
    setFeed(tweets);
  };

  // useEffect(() => {
  // 	if (openMediaUnit) {
  // 		recogniseTweetEmotion();
  // 	}
  // }, [openMediaUnit]);

  useEffect(() => {
    if (openMediaUnit) {
      getWeeklyTweets(session.token.sub)
        .then(({ data }) => {
          console.log(data);
          setFeed(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [openMediaUnit]);

  useEffect(() => {
    if (country) {
      getTrendingHashtags(session.token.sub, country)
        .then(({ data }) => setHashtags(data))
        .then(() => {
          getTrendingTopics(session.token.sub, country).then(({ data }) =>
            setTopics(data)
          );
        });
    }
  }, [country]);

  const clickHandler = (e) => {
    let el = e.target;
    console.log(el.tagName, el.parentNode.tagName);
    if (el.tagName === "SPAN") {
      console.log(el.innerText);
      router.push({
        pathname: "/admin/search",
        query: {
          searchTerm: el.innerText.trim().replace("#", "hashtag"),
        },
      });
    }
  };

  return (
    <React.Fragment>
      <MediaUnitsHeader
        openMediaUnit={openMediaUnit}
        setOpenMediaUnit={setOpenMediaUnit}
      />
      {openMediaUnit && (
        <Container className="my-4" fluid>
          <h3 className="text-black pb-2 text-uppercase">Weekly Analysis</h3>
          <Row>
            <Col
              className="scrollable_feed scrollbar padding_left_decreaser"
              lg="8"
            >
              {feed?.tweets?.length !== 0 &&
                feed?.tweets?.map((tweet, index) => {
                  return (
                    <TwitterCard key={tweet.id} tweet={tweet} feed={true} />
                  );
                })}
            </Col>
            <Col lg="4">
              <Col lg="12">
                <h4 className="text-black pb-2 text-uppercase">
                  Quantitative Analysis
                </h4>
                <Row>
                  <Col className="pb-3" lg="6">
                    <Card className="card-stats mb-6 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {"Number of Tweets"}
                            </CardTitle>
                            <h2 className="text-warning pt-2">{feed?.count}</h2>
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="pb-3" lg="6">
                    <Card className="card-stats mb-6 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {"Number of Likes"}
                            </CardTitle>
                            <h2 className="text-warning pt-2">{feed?.likes}</h2>
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="pb-3" lg="6">
                    <Card className="card-stats mb-6 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {"Number of Retweets"}
                            </CardTitle>
                            <h2 className="text-warning pt-2">
                              {feed?.retweets}
                            </h2>
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="pb-3" lg="6">
                    <Card className="card-stats mb-6 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {"Engagement Score"}
                            </CardTitle>
                            <h2 className="text-warning pt-2">
                              {Number(feed?.impression_score * 200).toFixed(2)}%
                            </h2>
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col lg="12">
                <h4 className="text-black pb-2 text-uppercase">
                  Trending Hashtags
                </h4>
                <Card className="card-frame">
                  <CardBody>
                    <select
                      style={{
                        width: "100%",
                        borderRadius: "5px",
                        marginLeft: "5px",
                        marginRight: "5px",
                      }}
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                    >
                      <option disabled value="">
                        Select Option
                      </option>
                      {[...countryList].map((country, index) => {
                        return (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ marginTop: 10 }}>
                      {hashtags
                        ?.filter((hashtag) => hashtag.tweet_count !== null)
                        ?.map(({ name }, index) => {
                          return (
                            <Badge
                              key={index}
                              style={{
                                marginBottom: "10px",
                                marginLeft: "5px",
                                marginRight: "5px",
                                cursor: "pointer",
                                textTransform: "none",
                              }}
                              color="info"
                              className="badge-md"
                              onClick={clickHandler}
                            >
                              {name}
                            </Badge>
                          );
                        })}
                      <div style={{ height: "100%", width: "100%" }}>
                        {hashtags?.length !== 0 && (
                          <ResponsiveContainer width="100%" height={160}>
                            <BarChart
                              width={400}
                              height={160}
                              data={hashtags.filter(
                                (hashtag) => hashtag.tweet_count !== null
                              )}
                            >
                              <Bar
                                background
                                isAnimationActive
                                dataKey="tweet_count"
                                fill="#8884d8"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {country && (
                <Col lg="12">
                  <h4 className="text-black pt-4 pb-2 text-uppercase">
                    Trending Topics
                  </h4>
                  <Card className="card-frame">
                    <CardBody>
                      <div style={{ marginTop: 10 }}>
                        {topics
                          ?.filter((topic) => topic.tweet_count !== null)
                          ?.map(({ name }, index) => {
                            return (
                              <Badge
                                key={index}
                                style={{
                                  marginBottom: "10px",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                  textTransform: "none",
                                }}
                                color="info"
                                className="badge-md"
                              >
                                {name}
                              </Badge>
                            );
                          })}
                        <div style={{ height: "100%", width: "100%" }}>
                          {topics?.length !== 0 && (
                            <ResponsiveContainer width="100%" height={160}>
                              <BarChart
                                width={400}
                                height={160}
                                data={topics.filter(
                                  (topic) => topic.tweet_count !== null
                                )}
                              >
                                <Bar
                                  background
                                  isAnimationActive
                                  dataKey="tweet_count"
                                  fill="#8884d8"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
}

management.layout = Admin;
management.requireAuth = true;

export default management;

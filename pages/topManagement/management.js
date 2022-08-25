import React, { useEffect, useState } from "react";
import MediaUnitsHeader from "components/Headers/MediaUnintsHeader.js";
import Admin from "layouts/Admin.js";
import { removeDuplicatesFromArrayOfObjects } from "../../utils/formatter";
import { emotionRecogniser } from "../../_api/emotions";
import { getTrendingHashtags, getWeeklyTweets } from "../../_api/twitter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import TwitterCard from "../../components/Post/TwitterFeedCard";
import CenterSpinner from "../../components/Loaders/CenterSpinner";

function management() {
  const router = useRouter();
  const { data: session } = useSession();
  const [feed, setFeed] = useState([]);
  const [openMediaUnit, setOpenMediaUnit] = useState(false);

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
    recogniseTweetEmotion();
  }, []);

  useEffect(() => {
    getWeeklyTweets(session.token.sub)
      .then(({ data }) => {
        console.log(data);
        setFeed(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  // 	getTrendingHashtags(())
  // }, []);

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
                    <TwitterCard
                      isEmotionShow
                      key={tweet.id}
                      tweet={tweet}
                      feed={true}
                    />
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
                    <Badge
                      style={{
                        marginBottom: "5px",
                        cursor: "pointer",
                      }}
                      color="warning"
                      className="badge-md"
                    >
                      Coming Soon
                    </Badge>
                  </CardBody>
                </Card>
              </Col>
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

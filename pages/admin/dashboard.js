import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
  Badge,
} from "reactstrap";
import Admin from "layouts/Admin.js";

import Header from "components/Headers/Header.js";
import ModalComponent from "../../components/Modal/Modal";
import { useRouter } from "next/router";
import { NEW_USER_REGISTRATION_CODED_STRING } from "../../utils/constants";
import { useSession } from "next-auth/react";
import {
  getFollowers,
  getTimeline,
  getTopFollower,
  getTopMediaTweet,
  getTopMention,
  getTopTweet,
} from "../../_api/dashboard";
import millify from "millify";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import moment from "moment";
import BestTime from "../../components/Bars/BestTime";

const Dashboard = () => {
  const {
    query: { state },
    ...router
  } = useRouter();
  const [isOpen, setModal] = useState(
    state === NEW_USER_REGISTRATION_CODED_STRING
  );
  const handleClose = () => setModal(false);

  const { data: session } = useSession();
  const [followObj, setFollowObj] = useState({});
  const [tweet, setTweet] = useState({});
  const [mediaTweet, setmediaTweet] = useState({});
  const [follower, setFollower] = useState({});
  const [mention, setMention] = useState({});
  const [timeline, setTimeline] = useState([]);

  const getFollowersCount = useCallback(
    (user_id) => {
      getFollowers(user_id).then(({ data }) => {
        setFollowObj(data);
      });
    },
    [session?.token?.sub]
  );

  const getTopTweeet = useCallback(
    (user_id) => {
      getTopTweet(user_id).then(({ data: { impression_score, tweet } }) => {
        setTweet({ ...impression_score, ...tweet });
      });
    },
    [session?.token?.sub]
  );

  const getTopMediaTweeet = useCallback(
    (user_id) => {
      getTopMediaTweet(user_id).then(
        ({ data: { impression_score, tweet } }) => {
          setmediaTweet({ ...impression_score, ...tweet });
        }
      );
    },
    [session?.token?.sub]
  );

  const getTopFolloweer = useCallback(
    (user_id) => {
      getTopFollower(user_id).then(({ data: { follower_count, follower } }) => {
        setFollower({ ...follower_count, ...follower });
      });
    },
    [session?.token?.sub]
  );

  const getTopMentionTweeet = useCallback(
    (user_id) => {
      getTopMention(user_id).then(({ data: { impression_score, mention } }) => {
        setMention({ ...impression_score, ...mention });
      });
    },
    [session?.token?.sub]
  );

  const getTimelinee = useCallback(
    (user_id) => {
      getTimeline(user_id).then(({ data }) => {
        const newTimeline = data?.followers?.map((fl) => {
          const followingFind = data?.followings?.find((f) => {
            if (String(f.date) === String(fl.date)) {
              return f;
            }
          });
          return {
            followersCount: fl["count"],
            followingsCount: followingFind["count"],
            date: moment(new Date(followingFind["date"] || fl["date"])).format(
              "MM-DD"
            ),
          };
        });
        setTimeline([...newTimeline]);
      });
    },
    [session?.token?.sub]
  );

  useEffect(() => {
    if (session?.token?.sub) {
      getFollowersCount(session?.token?.sub);
      getTopTweeet(session?.token?.sub);
      getTopMediaTweeet(session?.token?.sub);
      getTopFolloweer(session?.token?.sub);
      getTopMentionTweeet(session?.token?.sub);
      getTimelinee(session?.token?.sub);
    }
  }, [session?.token?.sub]);

  return (
    <>
      <Header followObj={followObj} />
      <Container className="mt-4" fluid>
        <div>
          <p className="text-primary text-uppercase font-weight-bolder mb-0">
            Tweet Highlights
          </p>
          <hr className="mt-2 mb-4" />
          <Row>
            <Col lg="6" xl="6" className="mb-4">
              <Card className="mb-4 mb-xl-0 shadow-lg rounded-lg">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h4"
                        className="text-uppercase font-weight-bolder text-warning mb-2"
                      >
                        Top Recent Tweet{" "}
                      </CardTitle>
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#364141",
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                        }}
                        className="p text-default mb-0"
                      >
                        {tweet["full_text"]}
                      </span>
                      <span className="mt-2 d-flex flex-row align-items-center">
                        <i className="text-danger mr-2 fas fa-heart"></i>
                        {tweet["favorite_count"] &&
                          millify(tweet["favorite_count"])}
                      </span>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="6" className="mb-4">
              <Card className="mb-4 mb-xl-0 shadow-lg rounded-lg">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h4"
                        className="text-uppercase font-weight-bolder text-warning mb-2"
                      >
                        Top Recent Media Tweet
                      </CardTitle>
                      {mediaTweet?.entities?.media?.map(
                        (media) =>
                          media.type == "photo" && (
                            <div key={media.id} style={{ cursor: "pointer" }}>
                              <img
                                className="mb-3 shadow-lg bg-white rounded-lg"
                                width="160px"
                                src={media.media_url_https}
                                alt={media.display_url}
                              />
                            </div>
                          )
                      )}
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#364141",
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                        }}
                        className="p text-default mb-0"
                      >
                        {mediaTweet["full_text"]}
                      </span>
                      <span className="mt-2 d-flex flex-row align-items-center">
                        <i className="text-danger mr-2 fas fa-heart"></i>
                        {mediaTweet["favorite_count"] &&
                          millify(mediaTweet["favorite_count"])}
                      </span>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="6" className="mb-4">
              <Card className="mb-4 mb-xl-0 shadow-lg rounded-lg">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase font-weight-bolder text-warning mb-2"
                      >
                        Top Recent Mention
                      </CardTitle>
                      <div className="d-flex flex-row justify-content-start align-items-start mb-2">
                        <img
                          className="rounded-lg shadow-lg"
                          width="75px"
                          height="75px"
                          alt={mention?.user?.profile_image_url}
                          src={mention?.user?.profile_image_url}
                        />
                        <div className="pl-4">
                          <span className="d-block font-weight-bolder">
                            {mention?.user?.name}
                          </span>
                          <span className="d-inline text-sm text-muted">
                            @{mention?.user?.screen_name}
                          </span>
                          <span
                            style={{ fontSize: 13 }}
                            className="d-block text-default pt-1"
                          >
                            {mention?.user?.description}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#364141",
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                        }}
                        className="p text-default mb-0"
                      >
                        {mention["text"]}
                      </span>
                      <span className="mt-2 d-flex flex-row align-items-center">
                        <i className="text-danger mr-2 fas fa-heart"></i>
                        {mention["favorite_count"] &&
                          millify(mention["favorite_count"])}
                      </span>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="6" className="mb-4">
              <Card className="mb-4 mb-xl-0 shadow-lg rounded-lg">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase font-weight-bolder text-warning mb-2"
                      >
                        Top Recent Follower
                      </CardTitle>
                      <div className="d-flex flex-row justify-content-start align-items-start">
                        <img
                          className="rounded-lg shadow-lg"
                          width="95px"
                          height="95px"
                          alt={follower["profile_image_url"]}
                          src={follower["profile_image_url"]}
                        />
                        <div className="pl-4">
                          <span className="d-block font-weight-bolder">
                            {follower["name"]}
                          </span>
                          <span className="d-inline text-sm text-muted">
                            @{follower["screen_name"]}{" "}
                            <Badge color="primary" className="badge-sm ml-2">
                              Follows you
                            </Badge>
                          </span>
                          <span
                            style={{ fontSize: 13 }}
                            className="d-block text-default pt-1"
                          >
                            {follower["description"]}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          router.push({
                            pathname: "/admin/userprofile",
                            query: { username: follower["screen_name"] },
                          });
                        }}
                        style={{ float: "right" }}
                        className="mt-3"
                        size="sm"
                        color="primary"
                      >
                        View Profile
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Row>
          <Col className="mb-5 mb-xl-4" xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent pt-5">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="text-uppercase text-default ls-1 mb-1 pl-5">
                      FOLLOWERS AND FOLLOWINGS VISUALIZATION
                    </h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={480}>
                  <AreaChart data={!!timeline.length && timeline}>
                    <defs>
                      <linearGradient
                        id="followersCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="followingsCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend
                      formatter={(value, { color }) => (
                        <span style={{ color }}>
                          {value === "followersCount"
                            ? "Followers Count"
                            : "Followings Count"}
                        </span>
                      )}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="followersCount"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#followersCount)"
                    />
                    <Area
                      type="monotone"
                      dataKey="followingsCount"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#followingsCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Col>
          <Col xl="12">
            <BestTime />
          </Col>
        </Row>
        <ModalComponent isOpen={isOpen} onClose={handleClose} />
      </Container>
    </>
  );
};

Dashboard.layout = Admin;
Dashboard.requireAuth = true;

export default Dashboard;

import millify from "millify";
import React, { useEffect, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import {
  Card,
  CardText,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
  Container,
  Badge,
} from "reactstrap";
import Tweets from "../../components/Profile/Tweets";
import Mentions from "../../components/Profile/Mentions";
import Followers from "../../components/Profile/Followers";
import Following from "../../components/Profile/Following";
import { useSession } from "next-auth/react";
import { getUserDetails, followUser } from "../../_api/profile";
import { useRouter } from "next/router";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { highlightLinkInText } from "../../utils/formatter";

function userprofile() {
  const { data: session } = useSession();
  console.log(session);
  const [tab, setTab] = useState("1");
  const [user, setUser] = useState({});
  const { query } = useRouter();

  useEffect(() => {
    if (session?.token?.sub && (query?.username || !query?.username)) {
      getUserDetails(session?.token?.sub, query?.username).then(
        ({ data: { profile } }) => {
          console.log(profile);
          setUser(profile);
        }
      );
    }

    return () => setUser({});
  }, [session?.token?.sub, query]);

  const follow_user = (e) => {
    // already follow-> to be unfollow
    if (user?.following) {
      setUser((prevUser) => ({
        ...prevUser,
        following: false,
      }));
      const bodyData = {
        user_id: session?.token?.sub,
        id: user?.id_str,
        following: "False",
      };
      followUser(bodyData)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }
    // if not follow
    setUser((prevUser) => ({
      ...prevUser,
      following: true,
    }));
    const bodyData = {
      user_id: session?.token?.sub,
      id: user?.id_str,
      following: "True",
    };
    followUser(bodyData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(user);
  };

  return (
    <Container className="pt-3" fluid>
      <Card
        className="shadow-lg rounded-lg"
        style={{
          borderTop: "8px solid #5e72e4",
          height: "calc(100vh - 64px)",
        }}
      >
        <Row style={{ height: "100%" }}>
          <Col className="py-4 pl-5" sm="3">
            <Nav pills vertical>
              {["Tweets", "Mentions", "Followers", "Following", "Fraud"].map(
                (item, index) => (
                  <NavItem
                    className={`${index + 1 === 5 ? "d-none" : "d-block"} my-1`}
                    style={{ cursor: "pointer" }}
                    key={index}
                  >
                    <NavLink
                      active={tab === String(index + 1)}
                      onClick={() => setTab(String(index + 1))}
                    >
                      {item}
                    </NavLink>
                  </NavItem>
                )
              )}
            </Nav>
          </Col>
          <Col
            style={{
              background: "#F7FAFC",
              height: "100%",
              overflow: "auto",
            }}
            className="scrollbar py-4"
            sm="6"
          >
            <TabContent activeTab={tab}>
              {tab === "1" && (
                <TabPane tabId="1">
                  {query?.username ? (
                    <Tweets
                      screen_name={query?.username}
                      user_id={session?.token?.sub}
                      tab={tab}
                    />
                  ) : (
                    <Tweets user_id={session?.token?.sub} tab={tab} />
                  )}
                </TabPane>
              )}
              {tab === "2" && (
                <TabPane tabId="2">
                  {query?.username ? (
                    <Mentions
                      screen_name={query?.username}
                      user_id={session?.token?.sub}
                      tab={tab}
                    />
                  ) : (
                    <Mentions user_id={session?.token?.sub} tab={tab} />
                  )}
                </TabPane>
              )}
              {tab === "3" && (
                <TabPane tabId="3">
                  {query?.username ? (
                    <Followers
                      screen_name={query?.username}
                      user_id={session?.token?.sub}
                      tab={tab}
                    />
                  ) : (
                    <Followers user_id={session?.token?.sub} tab={tab} />
                  )}
                </TabPane>
              )}
              {tab === "4" && (
                <TabPane tabId="4">
                  {query?.username ? (
                    <Following
                      screen_name={query?.username}
                      user_id={session?.token?.sub}
                      tab={tab}
                    />
                  ) : (
                    <Following user_id={session?.token?.sub} tab={tab} />
                  )}
                </TabPane>
              )}
            </TabContent>
          </Col>
          <Col className="pt-4" sm="3">
            <div
              style={{
                position: "relative",
                height: "80px",
                padding: "16px 16px 0px",
                margin: "0px 12px 0px",
                borderRadius: "6px",
              }}
              className="bg-primary"
            >
              <div
                style={{
                  float: "unset",
                  width: "68px",
                  margin: "24px 0px 0px",
                  border: "4px solid rgb(255, 255, 255)",
                  outline: "none",
                  background: "rgb(255, 255, 255)",
                  borderRadius: "999999px",
                }}
                className="shadow-lg"
              >
                <div
                  style={{
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    overflow: "hidden",
                    display: "flex",
                    position: "relative",
                    flexShrink: "0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      display: "block",
                      margin: 0,
                      width: "auto",
                      height: "100%",
                    }}
                    src={user?.profile_image_url_https}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-column mt-4 pt-2 pl-3">
              <div className="d-flex flex-row align-items-center justify-content-start">
                <BsTwitter
                  style={{ fontSize: "16px", color: "rgb(29, 161, 242)" }}
                  className="mr-3"
                />
                <p className="h3 mb-0">{user?.name}</p>
              </div>
              <div>
                <Badge
                  style={{
                    width: "fit-content",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                  color="primary"
                  className="badge-sm pr-4 mt-2"
                >
                  @{user?.screen_name}
                </Badge>
                {user?.verified && (
                  <MdVerified className="ml-2" color="#1EA1F2" />
                )}
              </div>
              <p style={{ lineHeight: "16px" }} className="mt-3">
                <small
                  dangerouslySetInnerHTML={{
                    __html:
                      user?.description &&
                      highlightLinkInText(user?.description),
                  }}
                />
              </p>
              <div className="d-flex flex-row align-items-center justify-content-start">
                <Badge
                  pill
                  color="warning"
                  className="font-weight-bolder badge-md px-4"
                >
                  {user?.followers_count &&
                    millify(parseInt(user?.followers_count))}{" "}
                  Followers
                </Badge>
                <p className="h5 ml-4 mt-2">
                  {user?.friends_count &&
                    millify(parseInt(user?.friends_count))}{" "}
                  Following
                </p>
              </div>
            </div>
            <hr
              style={{
                marginLeft: "15px",
                marginRight: "15px",
              }}
              className="my-3"
            />
            {query?.username && (
              <React.Fragment>
                <div
                  style={{
                    marginLeft: "18px",
                    marginRight: "18px",
                  }}
                  className="mt-3 d-flex flex-row align-items-center justify-content-between"
                >
                  <div className="d-flex flex-row align-items-center">
                    <img
                      width="35px"
                      height="35px"
                      className="mr-3 rounded-circle shadow-lg"
                      src={user?.profile_image_url_https}
                    />
                    <p className="mb-0">
                      <small>@{user?.screen_name}</small>
                    </p>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    {user?.following ? (
                      <RiUserUnfollowFill
                        onClick={follow_user}
                        style={{
                          fontSize: 25,
                          cursor: "pointer",
                          color: "#5E72E4",
                        }}
                      />
                    ) : (
                      <RiUserFollowFill
                        onClick={follow_user}
                        style={{ fontSize: 25, cursor: "pointer" }}
                      />
                    )}
                  </div>
                </div>
                <hr
                  style={{
                    marginLeft: "15px",
                    marginRight: "15px",
                  }}
                  className="my-3"
                />
              </React.Fragment>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default userprofile;

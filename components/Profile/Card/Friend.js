import millify from "millify";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { capitalizeFirstLetter } from "../../../utils/formatter";

function Friend({ following: friend }) {
  return (
    <div className="d-flex flex-row justify-content-start align-items-center p-3 mb-4 shadow-lg rounded-lg">
      <img
        width="90px"
        height="90px"
        className="mr-4 rounded-circle shadow-lg"
        src={friend?.profile_image_url_https}
      />
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex flex-row align-items-center">
          <div
            className="rounded-circle mr-2 position-relative bg-light"
            style={{ width: "32px", height: "32px" }}
          >
            <span
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              className="position-absolute font-weight-bolder"
            >
              {friend?.name && capitalizeFirstLetter(friend?.name)[0]}
            </span>
          </div>
          <BsTwitter
            style={{ fontSize: "16px", color: "rgb(29, 161, 242)" }}
            className="mr-2"
          />
          <p className="h3 mb-0 mr-2">{friend?.name}</p>
          <p className="h3 mb-0">
            <small>@{friend?.screen_name}</small>
          </p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-start mt-4">
          <p className="h5 mb-0">
            {friend?.followers_count !== 0
              ? millify(parseInt(friend?.followers_count))
              : "--"}{" "}
            Followers
          </p>
          <p className="h5 mb-0 ml-6">
            {friend?.friends_count !== 0
              ? millify(parseInt(friend?.friends_count))
              : "--"}{" "}
            Following
          </p>
        </div>
      </div>
    </div>
  );
}

export default Friend;

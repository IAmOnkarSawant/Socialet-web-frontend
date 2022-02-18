import React from "react";
import { BsTwitter } from "react-icons/bs";
import moment from "moment";

function ReplyTweetCard({ tweet }) {
  return (
    <section className="mb-4 rounded bg-white shadow-lg">
      <div className="d-flex flex-row align-items-center justify-content-between px-3 py-3">
        <div
          className="d-flex flex-row align-items-center"
          style={{ color: "rgb(54, 65, 65)" }}
        >
          <img
            style={{ width: "35px", height: "35px" }}
            className="mr-2 rounded-circle"
            src={tweet?.user?.profile_image_url}
            alt="display picture"
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
                {tweet?.user?.name}
              </span>
              <span style={{ fontSize: "13px" }} className="mr-2">
                @{tweet?.user?.screen_name}
              </span>
            </div>
          </div>
        </div>
        <div className="pr-3">
          <span style={{ fontSize: "13px" }}>
            {moment(new Date(tweet?.created_at)).startOf("day").fromNow()}
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
        >
          {tweet?.text}
        </span>
      </div>
      <hr className="mt-0 mb-1" />
      <div className="py-2 pl-4">
        <h4>- Replying to @{tweet?.user?.name}</h4>
      </div>
    </section>
  );
}

export default ReplyTweetCard;

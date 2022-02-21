import React from "react";

function NotFound({ property = "tweets", ...props }) {
  return (
    <div
      className="mt-5"
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    >
      <img
        style={{
          display: "block",
          marginRight: "auto",
          marginLeft: "auto",
          maxWidth: "300px",
          marginBottom: "20px",
        }}
        alt="NotFoundImage"
        src="https://d672eyudr6aq1.cloudfront.net/img/messages/no-messages.svgz"
      />
      <p className="h2 text-center">No {property} found.</p>
      <p className="text-center">
        <small>
          You don't have any {property} yet. All of your future {property} will
          appear here.
        </small>
      </p>
    </div>
  );
}

export default NotFound;

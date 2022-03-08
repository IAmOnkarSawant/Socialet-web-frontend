import { useRouter } from "next/router";
import React from "react";

function BackButton() {
  const router = useRouter();
  return (
    <div
      style={{
        bottom: 20,
        right: 20,
        zIndex: 1000000000000,
        width: 45,
        height: 45,
        position: "fixed",
        borderRadius: "50%",
        cursor: "pointer",
      }}
      className="bg-primary"
      onClick={() => router.back()}
    >
      <i
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        className="text-white fas fa-arrow-left"
      ></i>
    </div>
  );
}

export default BackButton;

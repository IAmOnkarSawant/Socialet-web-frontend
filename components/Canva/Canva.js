import React, { useState, useEffect } from "react";

function CanvaButton({ formik, type, ...props }) {
  const [canvaApi, setCanvaApi] = useState(null);

  useEffect(() => {
    function initCanva(document, url) {
      var script = document.createElement("script");
      script.src = url;
      script.onload = function () {
        if (window.Canva && window.Canva.DesignButton) {
          window.Canva.DesignButton.initialize({
            apiKey: process.env.NEXT_PUBLIC_CANVA_API_KEY,
          }).then((api) => setCanvaApi(api));
        }
      };
      document.body.appendChild(script);
    }
    initCanva(document, "https://sdk.canva.com/designbutton/v2/api.js");
  }, []);

  const handleCreateCanvaAd = () => {
    console.log(process.env);
    if (canvaApi) {
      console.log(canvaApi);
      canvaApi.createDesign({
        design: {
          type,
        },
        onDesignPublish: (opts) => {
          console.log(opts);
          formik.setFieldValue("selectedDesignURL", opts?.exportUrl);
        },
      });
    }
  };

  return (
    <span
      style={{
        pointerEvents: !type ? "none" : "all",
        cursor: !type ? "auto" : "pointer",
        opacity: !type ? "0.5" : "1",
      }}
      className={`canva-btn canva-btn-theme-default canva-btn-size-m`}
      onClick={() => handleCreateCanvaAd()}
    >
      <span class="canva-btn-i"></span>
      Design on Canva
    </span>
  );
}

export default CanvaButton;

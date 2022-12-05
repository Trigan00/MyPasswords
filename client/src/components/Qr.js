import React from "react";

function Qr({ url }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1em",
      }}
    >
      <img src={url} alt="qr" />
    </div>
  );
}

export default Qr;

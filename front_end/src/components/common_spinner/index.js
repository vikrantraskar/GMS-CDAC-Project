import { useState } from "react";
import { css } from "@emotion/react";
import BounceLoader from "react-spinners/ScaleLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const  CommonSpinner = (props) => {
  let [color] = useState("#ffffff");

  return (
    <div
      className="sweet-loading"
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '99999',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <BounceLoader loading={true} color={color} css={override} size={50} />
    </div>
  );
}

export default CommonSpinner;
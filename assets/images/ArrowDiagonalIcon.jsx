import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowDiagonalIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <Path
        fillRule="evenodd"
        fill="#A7A7A7"
        d="M5.228 14.772a.779.779 0 010-1.101l7.113-7.114H8.348a.778.778 0 110-1.557h5.873c.207 0 .405.082.55.228a.775.775 0 01.229.55v5.874a.78.78 0 11-1.558-.001V7.659l-7.113 7.113a.777.777 0 01-1.1 0z"
      />
    </Svg>
  );
}

export default ArrowDiagonalIcon;

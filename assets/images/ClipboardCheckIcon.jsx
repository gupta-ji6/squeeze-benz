import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ClipboardCheckIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={24}
      height={24}
      {...props}
    >
      <Path d="M13.28 9.22a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.75-1.75a.75.75 0 111.06-1.06l1.22 1.22 2.97-2.97a.75.75 0 011.06 0z" />
      <Path
        fillRule="evenodd"
        fill="#727272"
        d="M6.515 4.75A2 2 0 018.5 3h3a2 2 0 011.985 1.75h.265A2.25 2.25 0 0116 7v7.75A2.25 2.25 0 0113.75 17h-7.5A2.25 2.25 0 014 14.75V7a2.25 2.25 0 012.25-2.25h.265zM8.5 4.5h3a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3A.5.5 0 018 6V5a.5.5 0 01.5-.5zM6.513 6.23l.002.02H6.25A.75.75 0 005.5 7v7.75c0 .414.336.75.75.75h7.5a.75.75 0 00.75-.75V7a.75.75 0 00-.75-.75h-.265A2 2 0 0111.5 8h-3a2 2 0 01-1.987-1.77z"
      />
    </Svg>
  );
}

export default ClipboardCheckIcon;

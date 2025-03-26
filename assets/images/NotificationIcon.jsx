import * as React from "react";
import Svg, { Path } from "react-native-svg";

function NotificationIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={28}
      height={28}
      {...props}
    >
      <Path
        fillRule="evenodd"
        d="M7.252 14.424l-2.446-.281c-1.855-.213-2.38-2.659-.778-3.616l.065-.038A2.887 2.887 0 005.5 8.009V7.5a4.5 4.5 0 019 0v.51c0 1.016.535 1.958 1.408 2.479l.065.038c1.602.957 1.076 3.403-.778 3.616l-2.543.292v.365a2.7 2.7 0 01-5.4 0v-.376zm3.9.076h-2.4v.3a1.2 1.2 0 002.4 0v-.3zM8 13h4l3.024-.348a.452.452 0 00.18-.837l-.065-.038a4.414 4.414 0 01-.747-.562A4.387 4.387 0 0113 8.01V7.5a3 3 0 00-6 0v.51a4.387 4.387 0 01-2.138 3.767l-.065.038a.452.452 0 00.18.838L8 13z"
      />
    </Svg>
  );
}

export default NotificationIcon;

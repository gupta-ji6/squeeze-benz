import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ProductIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={28}
      height={28}
      {...props}
    >
      <Path d="M13 8a1 1 0 100-2 1 1 0 000 2z" />
      <Path
        fillRule="evenodd"
        fill="#727272"
        d="M11.276 3.5a3.75 3.75 0 00-2.701 1.149L4.321 9.066a2.75 2.75 0 00.036 3.852l2.898 2.898a2.5 2.5 0 003.502.033l4.747-4.571a3.25 3.25 0 00.996-2.341V6.75a3.25 3.25 0 00-3.25-3.25h-1.974zm-1.62 2.19a2.25 2.25 0 011.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 01-1.401-.014l-2.898-2.898a1.25 1.25 0 01-.016-1.75l4.253-4.418z"
      />
    </Svg>
  );
}

export default ProductIcon;

import * as React from "react"
import Svg, { Path } from "react-native-svg"

function HomeFilledIcon(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={28} height={28} {...props}>
      <Path d="M14 16h-2a1 1 0 01-1-1v-2.5a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5V15a1 1 0 01-1 1H6a2 2 0 01-2-2V9.743a3 3 0 01.879-2.122l3.707-3.707a2 2 0 012.828 0l3.707 3.707A3 3 0 0116 9.743V14a2 2 0 01-2 2z" />
    </Svg>
  )
}

export default HomeFilledIcon;

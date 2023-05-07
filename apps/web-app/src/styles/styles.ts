import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"
import colors from "./colors"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: colors.secondaryGray[200],
            color: "text.700"
        },
        "body, #__next": {
            minHeight: "100vh"
        },
        "#__next": {
            display: "flex",
            flexDirection: "column"
        }
    })
}

export default styles

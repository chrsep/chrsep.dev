import React, { FC } from "react"
import { Box } from "@theme-ui/components"

const Layout: FC = ({ children }) => (
  <Box as="main" m="auto" sx={{ maxWidth: 500 }}>
    {children}
  </Box>
)

export default Layout

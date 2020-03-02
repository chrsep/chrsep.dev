import React, { FC } from "react"
import { Box } from "@theme-ui/components"

const Layout: FC = ({ children }) => (
  <Box m="auto" sx={{ maxWidth: 400 }}>
    {children}
  </Box>
)

export default Layout

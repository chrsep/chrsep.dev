import React, { FC } from "react"

import SEO from "../components/seo"
import Layout from "../components/layout"

const IndexPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
  </Layout>
)

export default IndexPage

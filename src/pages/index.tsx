import React, { FC } from "react"

import { Heading, Text, Box } from "@theme-ui/components"
import SEO from "../components/seo"
import Layout from "../components/layout"

const IndexPage: FC = () => (
  <Layout>
    <Box mb={3} mt={6} mx={3}>
      <SEO
        title="Why are we here?"
        description="An interesting, thought provoking article."
      />
      <Heading as="h1" mb={2}>
        Why we are here.
      </Heading>
      <Heading as="h3" mb={3} opacity={0.6}>
        An interesting, thought provoking article.
      </Heading>
      <Box as="section" mb={4}>
        <Text mb={4}>
          This is just a placeholder text, nothing to see here yet, please
          comeback later. Bla bla bla bla. Some other text bla bla bla bla
          bla... Are we real? Is this real? Does it all make sense? It's up to
          us to figure it out. The best way to do it is to bla bla bla bla.
        </Text>
      </Box>
      <Box as="section" mb={4}>
        <Heading mb={3}>Interesting Section</Heading>
        <Text mb={3}>
          This is an interesting section, you see, its interesting. "But why?"
          You said to yourself. Sadly, i can't answer this question for you,
          this is something that only you can figure out.
        </Text>
        <Text mb={3}>
          I know that this is complicated, but don't be overwhelmed. You'll bla
          bla bla bla bla bla bla bla bla.... Because that is the only reason
          you exists and this is only reason we can agree on.
        </Text>
        <Text mb={3}>
          All of these are dandy, but the bigger question is, why are you here?
          Now, at this very moment, at this exact state, at this exact point of
          your life? And better yet, at this exact url in your browser?
        </Text>
      </Box>
      <Box as="section" mb={4}>
        <Heading mb={3}>The reason we're all here</Heading>
        <Text mb={3}>
          There are many reason why we have reason to be here, and none of them
          are right or wrong. Maybe boredom lead us to where we are today. Maybe
          curiosity drives us here. Maybe bla bla bla bla.
        </Text>
        <Text mb={3}>
          To make it simpler we can segment the reasons for our existence into 2
          different category.
        </Text>
        <Heading as="h3" mb={3}>
          First ambiguous reason
        </Heading>
        <Text mb={3}>
          There are always some ambiguous reason we can blame for. Something we
          made up on our mind, complex enough for us to believe, yet simple
          enough to avoid being scrutinized by logical thinking.
        </Text>
        <Text mb={3}>
          This is something we always hold dear but never inspect carefully. bla
          bla bla bla. This is all placeholder text. Bla bla bla. I'm just
          testing typography settings. Bla bla bla. It's existence stems from
          highly biased memory of a real thing that we experienced. But none of
          it is real.
        </Text>
        <Text mb={3}>
          It's all just an illusion. A figment of imaginary reality, we made up
          in our head to fill an unexplained hole inside our real understanding
          of reality.
        </Text>
        <Heading as="h3" mb={3}>
          The dreaded reason we don't want to believe
        </Heading>
        <Text mb={3}>
          Some reasons lies within the field we declared as to dangerous to
          venture to. Things that could break our believe if we ever touch them.
          Bla bla bla. Should be bla and bla. But is bla bla bla does google
          penalized article with "bla bla bla" now i wonder.
        </Text>
        <Text mb={3}>
          Do we need to confront this? Should we just let it stay in the dark?
          What should we do about theme? I believe this should be analyzed on a
          case by case basis. Somethings have positive results that justifies
          outweigh it's negative outcomes.
        </Text>
      </Box>

      <Box as="section" mb={4}>
        <Heading mb={3}>What does this all means than?</Heading>
        <Text mb={3}>
          This means that bla bla bla bla. Is something that only you can answer
          for yourself. This questions are to complex and to diverse to have a
          single definite answer. But in the end, the endgame is apparent.
        </Text>
        <Heading as="h3" mb={3}>
          None of it matters
        </Heading>
        <Text mb={3}>
          None of it matters. And by none i mean none. All the reasons leads up
          to a single fact, that we are here, today, on this site, wasting our
          time, reading nonsenses. Screwing around searching for an answer that
          might not even exists on the first place.
        </Text>
        <Text mb={3}>
          The only thing that matters is that we're here right now. Bla bla bla.
          Some bla bla bla. Some great build up to conclusion. Because all of
          that, the answer don't matter. What matters are what we do next. What
          we do after coming to this website.
        </Text>
        <Text mb={3}>
          The only clear fact is that we are here to do stuff. Stuff that we
          want to do. Stuff that we want to do because we think we need to do it
          to do something about something that we think should've been done but
          hasn't been done yet. That is the only thing that matters. And to that
          note, go and do something. Bla bla bla.
        </Text>
        <Text mb={3}>Good luck.</Text>
      </Box>
    </Box>
  </Layout>
)

export default IndexPage

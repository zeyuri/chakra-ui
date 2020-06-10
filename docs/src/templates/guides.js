import { Box, Flex, Heading, Text, Link, Stack, Avatar } from "@chakra-ui/core"
import { useLocation } from "@reach/router"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import { GithubLink } from "../components/github-edit-link"
import SEO from "../components/seo"

function LastEdited(props) {
  const { modifiedTime, editUrl, ...rest } = props
  return (
    <Flex
      as="footer"
      alignItems="center"
      justifyContent="space-between"
      {...rest}
    >
      <Box fontSize="sm" opacity={0.7}>
        Last updated: {modifiedTime}
      </Box>
      <GithubLink path={editUrl} />
    </Flex>
  )
}

const Body = (props) => {
  const {
    title,
    description,
    contributors,
    relativePath,
    body,
    modifiedTime,
  } = props
  const creator = contributors[0]
  return (
    <Box mx="auto" maxW="42rem" py="3rem">
      {creator && (
        <Stack marginBottom="1rem" direction="row" alignItems="center">
          <Avatar src={creator.image} />
          <Stack>
            <Link isExternal href={creator.url} fontWeight="semibold">
              {creator.name}
            </Link>
            <Text color="gray.500" fontSize="0.875rem" marginTop="0">
              {modifiedTime}
            </Text>
          </Stack>
        </Stack>
      )}
      <Box marginBottom="3rem">
        <Heading size="xl" as="h1" fontWeight={800}>
          {title}
        </Heading>
        <Text mt="1">{description}</Text>
      </Box>
      <MDXRenderer>{body}</MDXRenderer>
      {relativePath && (
        <LastEdited
          mt="3rem"
          modifiedTime={modifiedTime}
          editUrl={relativePath}
        />
      )}
    </Box>
  )
}

const Guides = ({ data, pageContext }) => {
  const location = useLocation()
  const { previous, next, slug, relativePath, modifiedTime } = pageContext
  const { body, frontmatter, fields, tableOfContents } = data.mdx
  const { title, description } = frontmatter
  const { contributors } = fields

  return (
    <>
      <SEO title={title} description={description} slug={slug} />
      <Body
        pathname={location.pathname}
        body={body}
        title={title}
        description={description}
        previous={previous}
        next={next}
        slug={slug}
        tableOfContents={tableOfContents}
        contributors={contributors}
        relativePath={relativePath}
        modifiedTime={modifiedTime}
      />
    </>
  )
}

// query for page's `body`, `title`, and `description` using the page's `slug`
export const query = graphql`
  query guideBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      fields {
        contributors {
          name
          image
          url
        }
      }
      frontmatter {
        title
        description
      }
      tableOfContents
    }
  }
`

export default Guides

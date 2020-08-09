import * as github from "@actions/github"
import { WebhookPayload } from "@actions/github/lib/interfaces"
import nock from "nock"
import run from "../needs-triage"

beforeEach(() => {
  jest.resetModules()

  github.context.payload = {
    action: "opened",
    issue: {
      number: 1,
    },
  } as WebhookPayload
  process.env["GITHUB_REPOSITORY"] = "chakra-ui/chakra-ui"
  process.env["GITHUB_TOKEN"] = "12345"
})

test('adds a "needs triage" label', async () => {
  nock("https://api.github.com")
    .persist()
    .post("/repos/chakra-ui/chakra-ui/issues/1/labels", {
      labels: ["needs triage"],
    })
    .reply(200, [
      {
        url: "https://github.com/chakra-ui/chakra-ui/labels/needs%20triage",
      },
    ])

  await run()
})

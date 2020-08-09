import * as core from "@actions/core"
import * as github from "@actions/github"

const run = async () => {
  try {
    // Limit only to when issues are opened (not edited, closed, etc.)
    if (github.context.payload.action !== "opened") return

    // Check the payload
    const issue = github.context.payload.issue
    if (!issue) return

    const token = process.env["GITHUB_TOKEN"]
    if (!token) return

    // Create the octokit client
    const octokit = github.getOctokit(token)
    const nwo = process.env["GITHUB_REPOSITORY"] || "/"
    const [owner, repo] = nwo.split("/")

    // Attach the "needs-triage" label
    const issueLabelResponse = await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issue.number,
      labels: ["needs triage"],
    })
    console.log(
      `Attached "needs triage" label: ${issueLabelResponse.data[0].url}`,
    )
  } catch (error) {
    console.error(error.message)
    core.setFailed(`needs-triage failure: ${error}`)
  }
}

run()

export default run

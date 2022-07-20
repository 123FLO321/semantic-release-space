# semantic-release-space

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a
[JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html).

[![npm latest version](https://img.shields.io/npm/v/semantic-release-space/latest.svg)](https://www.npmjs.com/package/semantic-release-space)
[![npm next version](https://img.shields.io/npm/v/semantic-release-space/next.svg)](https://www.npmjs.com/package/semantic-release-space)
[![npm beta version](https://img.shields.io/npm/v/semantic-release-space/beta.svg)](https://www.npmjs.com/package/semantic-release-space)

| Step               | Description                                                                                                                                                  |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `verifyConditions` | Verifies that all required options are set.                                                                                                                  |
| `prepare`          | Creates a [JetBrains Space Deployment Target](https://www.jetbrains.com/help/space/deployments.html#creating-a-deployment-targetl) if it does not yet exist. |
| `publish`          | Starts a [JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html).                                                                |
| `success`          | Marks the [JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html) as completed.                                                  |
| `fail`             | Marks the [JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html) as failed.                                                     |

## Install

```bash
$ npm install --save-dev semantic-release-space
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
"plugins": [
  ...
  [
    "semantic-release-space", {
      "targetId": "example-target"
    }
  ]
  ...
]
```

With this example a [JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html) will be published on the `example-target` deployment target .

## Configuration

Make sure to set `targetId` or `JB_SPACE_TARGET_ID` to the deployment target you want to use.
All other options are automatically set via their environment variables in a Space Job.

### Options and Environment variables

| Option           | Environment variable           | Type                  | Description                                                                                                                    |
|------------------|--------------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `target`         | `JB_SPACE_TARGET_ID`           | `TargetConfiguration` | **Required**<br/>The Space deployment target(s)<br>Set to an key value object to specify target(s) per branch.                 |
| `projectId`      | `JB_SPACE_PROJECT_ID`          | `string`              | **Required** *Automatically set in JetBrains Space Jobs*<br/>The Space project id                                              |
| `apiUrl`         | `JB_SPACE_API_URL`             | `string`              | **Required** *Automatically set in JetBrains Space Jobs*<br/>The Space API url                                                 |
| `apiToken`       | `JB_SPACE_CLIENT_TOKEN`        | `string`              | **Required** *Automatically set in JetBrains Space Jobs*<br/>The Space API auth token                                          |
| `repositoryName` | `JB_SPACE_GIT_REPOSITORY_NAME` | `string`              | **Required** *Automatically set in JetBrains Space Jobs*<br/>The repositories name                                             |
| `requireTarget`  | `JB_SPACE_REQUIRE_TARGET`      | `boolean`             | *Defaults to true*<br/>If set to false an invalid or missing target configuration will be ignored instead of throwing an error |

#### Option Types
- TargetConfiguration: `string | string[] | { [branch: string]: string | string[] }` 

## Job Example

With this example the package.json will be pumped and committed, a NPM package will be published and a [JetBrains Space Deployment](https://www.jetbrains.com/help/space/deployments.html)
of the new tag will be published on the `example-target` deployment target.

### Authentication

- Go into your Space Instance > Extensions > Applications and create a new Application (or select an existing one).
- Go into Authorization and give the Application at least the following permissions for the target project:
  - `Read Git repositories`
  - `Write Git repositories`
  - `Create package registries`
  - `Read package registries`
  - `Write package registires`
- Go into Permanent Tokens and create and copy a new token for the Application.
- Go into Projects > your target project > Settings > Secrets & Parameters > and create a new secret:
  - key: `ci-token`
  - value: `<application key>:<the token you just coppied>`

### .releaserc
```json
{
  "branches": [
    "main"
  ],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {}
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "linkCompare": false,
        "linkReferences": false
      }
    ],
    [
      "semantic-release-space",
      {
        "targetId": "example-target"
      }
    ],
    [
      "@semantic-release/npm",
      {}
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json"
        ],
        "message": "release: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

### .space.kts
```kotlin
job("Verify") {
  git {
    refSpec = "refs/heads/main"
  }

  container(displayName = "Publish", image = "node:lts") {
    env["GIT_CREDENTIALS"] = Secrets("ci-token")
    env["NPM_TOKEN"] = Secrets("ci-token")
    shellScript {
      content = """
        npm install
        npx semantic-release --ci=false
      """
    }
  }
}
```

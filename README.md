## Description

Mock test results microservice, deployed as an [Azure Container App](https://docs.microsoft.com/en-us/azure/container-apps/).

## Installation

**Note:** Docker images built on Apple Silicon are not compatible with Azure Linux (amd64) VMs.

```bash
$ docker build -t mock-tests --platform=linux/amd64 .
```

Publish the image to the Docker Hub (ex.: docker.io/pxcdev/mock-tests).

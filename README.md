## Description

Mock test results microservice, deployed as an [Azure Container App](https://docs.microsoft.com/en-us/azure/container-apps/).

## Installation with Pulumi
```bash
cd
```

---
## Installation

**Note:** Docker images built on Apple Silicon are not compatible with Azure Linux (amd64) VMs.

```bash
docker build -t mock-tests --platform=linux/amd64 .
```

Publish the image to the Docker Hub (ex.: pxcdev/mock-tests).

```bash
docker tag mock-tests:latest pxcdev/mock-tests:latest
docker push pxcdev/mock-tests:latest
```

Update container app with latest image:

```bash
az containerapp update --name mock-labs-container-app --resource-group $RESOURCE_GROUP --image docker.io/pxcdev/mock-tests:latest
```

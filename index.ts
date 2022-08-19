import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';

import * as resources from '@pulumi/azure-native/resources';
import * as app from '@pulumi/azure-native/app';
import * as containerregistry from '@pulumi/azure-native/containerregistry';

const resourceGroupName = 'pxcdev-rg-container-apps';
const environmentName = 'pxcdev-labs-environment';

const resourceGroup = resources.getResourceGroupOutput({ resourceGroupName });

const containerAppsEnv = app.getManagedEnvironmentOutput({
  resourceGroupName,
  environmentName,
});

const registry = new containerregistry.Registry('registry', {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: 'Basic',
  },
  adminUserEnabled: true,
});

const credentials = containerregistry.listRegistryCredentialsOutput({
  resourceGroupName: resourceGroup.name,
  registryName: registry.name,
});
const adminUsername = credentials.apply(
  (c: containerregistry.ListRegistryCredentialsResult) => c.username!,
);
const adminPassword = credentials.apply(
  (c: containerregistry.ListRegistryCredentialsResult) =>
    c.passwords![0].value!,
);

const customImage = 'mock-lab-results';
const myImage = new docker.Image(customImage, {
  imageName: pulumi.interpolate`${registry.loginServer}/${customImage}:v1.0.0`,
  build: { context: `.`, extraOptions: ['--platform=linux/amd64'] },
  registry: {
    server: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  },
});

const containerApp = new app.ContainerApp('mock-lab-results-app', {
  resourceGroupName: resourceGroup.name,
  managedEnvironmentId: containerAppsEnv.id,
  configuration: {
    ingress: {
      external: true,
      targetPort: 3000,
    },
    registries: [
      {
        server: registry.loginServer,
        username: adminUsername,
        passwordSecretRef: 'pwd',
      },
    ],
    secrets: [
      {
        name: 'pwd',
        value: adminPassword,
      },
    ],
  },
  template: {
    containers: [
      {
        name: 'myapp',
        image: myImage.imageName,
      },
    ],
  },
});

export const url = pulumi.interpolate`https://${containerApp.configuration.apply(
  (c: any) => c?.ingress?.fqdn,
)}`;

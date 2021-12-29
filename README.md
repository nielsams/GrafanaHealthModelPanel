# Grafana
This directory contains all the files needed for the automated provisioning of the Grafana monitoring solution.

## Contents
When the Dockerfile is built, a container is created with the following:

- Grafana
- Azure Monitor data source
- Healthmodelpanel custom visualization

## Environment Variables
The container expects the following environment variables to be set:

| Name | Value   |
|------|---------|
| GRAFANA_USERNAME | Username for the Grafana instance |
| GRAFANA_PASSWORD | Password used with username |
| AZURE_DEFAULT_SUBSCRIPTION | Id of the Azure subscription that holds the Log Analytics instances |

## Managed Identity
The data source has been set for Managed Identity authentication to Azure.
This means that the infrastructure running the container, e.g. Azure App Service, should have its system-managed identity enabled and that identity should be assigned, at minimum, the 'Log Analytics Reader' permission on a scope that includes all required Log Analytics instances.

## Grafana Authentication
Currently, authentication has been set to a username/password. Obviously this is not the best way in production scenarios, but OAuth authentication requires external dependencies that make this reference implementation harder to deploy and may be subject to security constraints in your local environment. 

Before deploying this to your production environment, it is *highly recommended* to enable OAuth. This is done by editing the grafana.ini file and uncommenting/filling the values under the authentication section. Naturally, don't add secrets there. You can add ${MY_SECRET_VALUE} as a value and include that at runtime through environment variables. 

## Note about line endings
When editing on Windows, ensure that for the dashboard queries as well as the .ts and .tsx files, line endings are set to **LF** to ensure a smooth docker build process.



# Grafana Health Model Panel

The health model has been implemented in Azure Log Analytics using KQL queries. This is a custom Grafana visualization panel, which can be used to visualize that health model. It's main purpose is to visualize, in an intuitive way:

- The health state of each component
- The hierarchical dependencies between components.

This document describes the specifics of the custom Grafana visualization and the dependencies it has on the underlying solution. For a broader context, view the (TODO) reference implementation health model or the (TODO) top-level guidance on health modeling.

## Usage

### Input Data

The panel depends on a Log Analytics query result that contains the relevant information. The following columns are required in the query result:

- **ComponentName** is the name of the component as it is displayed in the health model graph.
- **Dependencies** holds a comma-separated list of components that the specific component depends on. The names should match the 'ComponentName' value of the respective component.
- **HealthScore** is used to determine the color of the visualization. The values used here should match with the threshold values described in the panel options.

As an example, the query we use in the reference implementation is:

```kql
WebsiteHealthScore
| union ViewClaimUserFlowHealthScore
| union PostClaimUserFlowHealthScore
| union EventHubHealthScore
| union KeyvaultHealthScore
| union ClaimServiceHealthScore
| union ClaimWorkerHealthScore
| union ClusterHealthScore
```

This gives the following result, which is the input for the health model panel:

| ComponentName     | HealthScore | Dependencies                        |
| :---------------- | :---------- | :---------------------------------- |
| Website           | 1           | ViewClaimUserFlow,PostClaimUserFlow |
| ViewClaimUserFlow | 1           | ClaimService,Keyvault               |
| PostClaimUserFlow | 1           | Eventhub,ClaimWorker,Keyvault       |
| ClaimService      | 1           | Cluster                             |
| ClaimWorker       | 1           | Cluster                             |
| EventHub          | 1           |                                     |
| Keyvault          | 1           |                                     |
| Cluster           | 1           |                                     |

This query is subsequently visualized in the following way:
![Example healthmodelpanel](./media/healthmodel-example.png)

# Build & Deploy

## Option 1: Docker Build for the entire Grafana container

1. Docker build:
   `docker build -t grafana-healthmodelpanel .`

This docker container contains a full Grafana install as well as the healthmodel panel and can be run directly on any container hosting environment. The required environment variable for running unsigned panels has already been set.

## Option 2: Manually Build the healthmodel panel

1. Go to the _healthmodelpanel_ directory

2. Install packages:
   `yarn install`

3. Build the project:
   `yarn build`

4. Copy `./dist/*` to `/var/lib/grafana/plugins/healthmodelpanel` of your Grafana installation.

5. In order to run an unsigned Grafana panel, ensure that the following environment variable has been set:
   `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="healthmodelpanel"`


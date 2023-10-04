---
sidebar_position: 1
description: A quick overview of how everything works together.
---

# Overview

## Considerations

There are only two components needed to run Sisyphus, but some considerations must be made.  Clients are only as good as the data they can access.  It's recommended that all of the clients share a common file system like SMB or NFS so any client can access a file on the share at the same location on the file system.

For a single encoder running on the same computer/VM as the client, this isn't an issue as all the clients share the same local file system.

## Installation Order

To get everything setup, there is a definite order of operations.  The installation procedure should go like this:

- `sisyphus-server`: The central API server.
- `sisyphus-client`: The encoding client.
- `sisyphus-frontend`: A single-page website that shows a good overview of all the parts of the system to include queue and worker information.  This is completely optional.

## Networking

The clients must be able to talk to the API server as each client has a heartbeat that goes back to the API server.  Job information also comes from the API server, and each client polls the API server for new jobs.

If installing the `sisyphus-frontend`, this can be installed on the same computer/VM as the `sisyphus-server`.

## Requirements

While `docker` is not required to install all of the components, it does make things much easier.  Each part of Sisyphus includes a Docker Compose file that will setup all of the containers and run the needed services with minimal setup.

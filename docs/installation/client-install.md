---
sidebar_position: 3
description: A simple and concise client installation guide.
---

# Installing the Client

## Description

The `sisyphus-client` is basically a Python application that queries the API server for jobs, parses the job for all of the tasks, then runs each task from the job sequentially by loading the appropriate Python module for each task.

It's also responsible for sending back worker and progress information via the heartbeat to the API server which is how everything gets tracked on the frontend.

:::info

As with the `sisyphus-server`, it's recommended to install/run this via the Docker Compose command.  The Alpine container has all of the required binaries installed for Ffmpeg and Matroska which are required for the client to run correctly.

:::

## Requirements

If not using the Docker Compose file:
- Python (version `3.10` or greater)
- Poetry (for Python dependency management)
- Ffmpeg (installed and in the system path)
- MkvToolNix (installed and in the system path)
- Handbrake (the CLI version installed and in the system path)

:::caution

Ensure that the client has enough memory to work.  Failure to provide enough RAM can cause failures that are hard to track down as processes start getting killed to free up RAM.

For a `handbrake` encode at 1080p using the _SvtAV1_ codec required 10-12 GiB of RAM whereas `ffmpeg` encoding H265 required less.  If you start seeing issues with failures, double-check that you're not running out of RAM.

:::

## Environment Variables

### Docker Compose

For the Docker Compose configuration, there are four environment variables that can be set:

| Variable | Description |
|:--|:--|
| `HOSTNAME_OVERRIDE` | The client will use the default hostname of the computer it's running on.  Setting this value will override that. |
| `API_URL` | The URL of the Sisyphus API server.  This is must be set correctly for the client to work. Defaults to `http://localhost:5000`.|
| `LOGURU_LEVEL` | This defaults to `INFO`, but can be set to any supported Loguru level. For more information, please consult the [`loguru` documentation](https://loguru.readthedocs.io/en/stable/index.html). |
| `HOST_UUID` | This needs to be set to a proper UUID.  If not, then everytime the client starts up it will have a new UUID which is not ideal. |

### Client Specific

These variables can be passed directly to the Sisyphus client to change all manner of things.

| Variable | Default | Description |
|:--|:--|:--|
| `API_URL` | `http://localhost:5000` | The URL of the Sisyphus API server.  This is must be set correctly for the client to work. |
| `API_TIMEZONE` | `UTC` | The timezone to use when generating date/time information. |
| `HOSTNAME` | See description. | This defaults to the actual hostname of the computer.  Setting this will override the hostname being sent back to the API server. |
| `HOST_UUID` | See description. | The UUID to use to uniquely identify the client by the central API server.  If this is not set, it will generate a new UUID every client restart. |
| `HEARTBEAT_INTERVAL` | `5` | The time between sending heartbeat messages to the API server, measured in seconds. |
| `QUEUE_POLL_INTERVAL` | `10` | The time between polling requests from the client, also measure in seconds. |
| `NETWORK_RETRY_INTERVAL` | `20` | The time between attempting to reconnect to the API server, measured in seconds. |
| `LOGURU_LEVEL` | `DEBUG` | This defaults to `INFO`, but can be set to any supported Loguru level. For more information, please consult the [`loguru` documentation](https://loguru.readthedocs.io/en/stable/index.html). |

## Installation

### Docker Compose

The Docker Compose file will build the `sisyphus-client` container which also has all of the requirements installed such as `ffmpeg` and `mkvtoolnix` as well.  This means that the latest versions of the required binaries are present in the container and nothing is required other than setting a few environment variables to get started.

#### Procedure

1. Clone the [`sisyphus-client`](https://github.com/JamesTheBard/sisyphus-client) repository.

    ```bash
    git clone https://github.com/JamesTheBard/sisyphus-client
    ```

2. Navigate to the `docker` directory.

    ```bash
    cd sisyphus-client/docker
    ```

3. Run the Docker Compose file in the directory.

    ```bash title="Linux"
    export API_URL="http://api.server.url.here:5000"
    export HOST_UUID="00000000-1111-2222-3333-444444444444"
    docker compose up -d
    ```

    ```powershell title="Windows (PowerShell)"
    $Env:API_URL = "http://api.server.url.here:5000"
    $Env:HOST_UUID = "00000000-1111-2222-3333-444444444444"
    docker compose up -d
    ```

4. Verify that the container has started successfully by querying the API server for available workers.  The new worker should appear in the `/workers` list.

    ```bash
    curl -X GET http://api.server.url.here:5000/workers
    ```

    ```json title="Output"
    {
      "workers": [
        {
          "status": "idle",
          "hostname": "encode001",
          "version": "1.3.4",
          "online_at": "2023-10-02 16:39:02.714402+00:00",
          "worker_id": "00000000-1111-2222-3333-444444444444",
          "attributes": {
            "disabled": false
          }
        }
      ],
      "count": 1
    }
    ```

### Without Docker

:::info

On the client, you will need to install `ffmpeg`, `handbrake-cli`, and `mkvtoolnix`.  These are required for the client to actually encode and mux videos.  Failure to do this will cause every job to crash and burn.

To install the dependencies for `sisyphus-client`, you will also need to make sure that Python is install along with `poetry`.  For more information, refer to the [Poetry documentation](https://python-poetry.org/docs/).

:::

1. Clone the [`sisyphus-client`](https://github.com/JamesTheBard/sisyphus-client) repository.

    ```bash
    git clone https://github.com/JamesTheBard/sisyphus-client
    ```

2. Install all of the dependencies using `poetry`.

    ```bash
    poetry install
    ```

3. Install the `ffmpeg` and `mkvtoolnix` binaries.  This will depend on what operating system you are installing this on.  Ensure that the binaries associated with both are in either the system or user path.

4. Set all of the environment variables and run the `sisyphus-client` application.

    :::caution

    It's recommended to run this in something like a `tmux` window or a service that runs in the background otherwise closing the terminal window will eat your client.

    :::

    ```bash title="Linux"
    export API_URL="http://api.server.url.here:5000"
    export HOST_UUID="00000000-1111-2222-3333-444444444444"
    export LOGURU_LEVEL="INFO"
    poetry run python client.py
    ```

    ```powershell title="Windows (PowerShell)"
    $Env:API_URL = "http://api.server.url.here:5000"
    $Env:HOST_UUID = "00000000-1111-2222-3333-444444444444"
    $Env:LOGURU_LEVEL = "INFO"
    poetry run python client.py
    ```

5. Verify that the container has started successfully by querying the API server for available workers.  The new worker should appear in the `/workers` list.

    ```bash
    curl -X GET http://api.server.url.here:5000/workers
    ```

    ```json title="Output"
    {
      "workers": [
        {
          "status": "idle",
          "hostname": "encode001",
          "version": "1.5.4",
          "online_at": "2023-10-02 16:39:02.714402+00:00",
          "worker_id": "00000000-1111-2222-3333-444444444444",
          "attributes": {
            "disabled": false
          }
        }
      ],
      "count": 1
    }
    ```


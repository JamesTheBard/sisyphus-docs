---
sidebar_position: 2
description: Everything you need to install the server.
---

# Installing the Server

## Description

The `sisyphus-server` is a Flask API written in Python.  It uses `poetry` to handle dependencies and should be fairly simple to setup without the container.

:::info

While there are instructions to install the API server without the container, it's _recommended_ to use the Docker Compose file as it already has all of the things that API servers crave.

:::

## Requirements

If not using the Docker Compose file:
- Python (version `3.10` or greater)
- Poetry (for Python dependency management)
- Redis (either `redis` or `keydb`)
- MongoDB or FerretDB

## Environment Variables

### Docker Compose

Also, two environment variables need to be passed to `sisyphus-server`:

| Variable | Default | Description |
|:--|:--|:--|
| `REDIS_URI` | `redis://localhost:6397` | URI to the Redis server.  Required for proper queue and worker status operations. |
| `MONGO_URI` | `mongodb://root:root@localhost:27017` | URI to the MongoDB server. Holds job information, module information. |

### Server Specific

| Variable | Default | Description |
|:--|:--|:--|
| `REDIS_URI` | `redis://localhost:6397` | URI to the Redis server.  Required for proper queue and worker status operations. |
| `MONGO_URI` | `mongodb://root:root@localhost:27017` | URI to the MongoDB server. Holds job information, module information. |
| `CLIENT_EXPIRY` | `30` | The amount of time a worker that must elapse before removing a worker/client from the server, measured in seconds. |
| `SERVER_TIMEZONE` | `UTC` | The timezone the server should use for all date/time information. |
| `MONGO_DATA_DB` | `sisyphus_modules` | The database in the MongoDB where all server-side module data lives. |
| `MONGO_DATA_COLL_PREFIX` | `data_` | The prefix to use when getting information for modules.  For example, the `ffmpeg` module would use the collection `data_ffmpeg` to store its information. |
| `MONGO_JOB_DB` | `sisyphus_jobs` | The database to store job information in. |
| `MONGO_JOB_FAILED` | `failed` | The collection to store failed jobs from workers/clients in. |
| `MONGO_JOB_COMPLETED` | `completed` | The collection to store successfully completed job in. |
| `MONGO_JOB_QUEUED` | `queued` | The collection to store queued and running jobs in. |
| `REDIS_QUEUE_NAME` | `queue` | The name of the linked list in Redis to store the job queue information. |
| `REDIS_WORKER_PREFIX` | `worker` | The prefix used to build out worker keys to store worker information in Redis. |

## Installation

### Docker Compose

The Docker Compose file will build the `sisyphus-server` container, spin up KeyDB and MongoDB containers, and spin up a Mongo Express container.  It will also handle networking across those containers and expose the appropriate ports.

| Service | Port | Description |
|:--:|:--:|:--|
| `redis` | `6379` | KeyDB runs on the default Redis port and is used for queue operations, worker status. |
| `mongo` | `27017` | MongoDB runs on the default MongoDB port and is used to store per-module information and job information. |
| `mongo-express` | `8081` | Mongo Express makes it easier to add and browse MongoDB. |
| `sispyhus-server` | `5000` | Sisyphus API server runs on port 5000 by default and coordinates all workers. |

#### Procedure

1. Clone the [`sisyphus-server`](https://github.com/JamesTheBard/sisyphus-server) repository.

    ```bash
    git clone https://github.com/JamesTheBard/sisyphus-server
    ```

2. Navigate to the `docker` directory.

    ```bash
    cd sisyphus-server/docker
    ```

3. Run the Docker Compose file in the directory.

    ```bash
    docker compose up -d
    ```

4. Verify that the containers are running successfully.

    ```bash
    docker compose ps
    ```

    ```console title="Output"
    NAME                                IMAGE                             COMMAND                                                                                         SERVICE           CREATED        STATUS        PORTS
    sisyphus-server-mongo-1             mongo:latest                      "docker-entrypoint.sh mongod"                                                                   mongo             23 hours ago   Up 23 hours   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp
    sisyphus-server-mongo-express-1     mongo-express:latest              "tini -- /docker-entrypoint.sh mongo-express"                                                   mongo-express     23 hours ago   Up 23 hours   0.0.0.0:8081->8081/tcp, :::8081->8081/tcp
    sisyphus-server-redis-1             eqalpha/keydb:latest              "keydb-server /etc/keydb/keydb.conf --appendonly yes --server-threads 4"                        redis             23 hours ago   Up 23 hours   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp
    sisyphus-server-sisyphus-server-1   sisyphus-server-sisyphus-server   "gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - --error-logfile - --log-level info app:app"   sisyphus-server   23 hours ago   Up 23 hours   0.0.0.0:5000->5000/tcp, :::5000->5000/tcp
    ```

5. To verify that the server is up, query the `/queue` endpoint.

    ```bash
    curl -X GET https://localhost:5000/queue 
    ```

    ```json title="Output"
    {"queue": [], "entries": 0, "attributes": {"disabled": false}}
    ```

### Without Docker

:::info

You will need to install `redis` or `keydb` along with `mongodb` or `ferretdb` before continuing.  These are required for the API server to run.

To install the dependencies for `sisyphus-server`, you will also need to make sure that Python is install along with `poetry`.  For more information, refer to the [Poetry documentation](https://python-poetry.org/docs/).

:::

1. Clone the [`sisyphus-server`](https://github.com/JamesTheBard/sisyphus-server) repository.

    ```bash
    git clone https://github.com/JamesTheBard/sisyphus-server
    ```

2. Install all of the dependencies using `poetry`.

    ```bash
    poetry install
    ```

3. Once that has completed, set the environment variables for the Redis and MongoDB URIs.  These must be set so that the API server knows where to store data.

    :::caution

    It's recommended to run this in something like a `tmux` window or a service that runs in the background otherwise closing the terminal window will eat your server.

    :::

    ```bash title="Linux"
    export REDIS_URI="redis://redis.url.goes.here:6379"
    export MONGO_URI="mongodb://user:password@mongo.url.goes.here:27017"
    poetry run gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - --error-logfile - --log-level info app:app
    ```

    ```powershell title="Windows (PowerShell)"
    $Env:REDIS_URI = "redis://redis.url.goes.here:6379"
    $Env:MONGO_URI = "mongodb://user:password@mongo.url.goes.here:27017"
    poetry run gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - --error-logfile - --log-level info app:app
    ```

4. To verify that the server is up, query the `/queue` endpoint.

    ```bash
    curl -X GET https://localhost:5000/queue 
    ```

    ```json title="Output"
    {"queue": [], "entries": 0, "attributes": {"disabled": false}}
    ```

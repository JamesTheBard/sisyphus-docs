---
slug: /
sidebar_position: 1
---

# Introduction

The Sisyphus encoding system is a distributed encoding solution written in Python that uses a central server to queue up encoding jobs that are then distributed to one or more encoding workers/clients.

![Sisyphus Frontend screenshot](installation/img/sisyphus_frontend_image.png)

## Components

The Sisyphus encoding system is comprised of three main parts:

The `sisyphus-server` where all jobs are queued up and handed out to available workers/clients.  It also manages worker status information.

The `sisyphus-client` is the worker software that pulls jobs from the API server job queue, processes the tasks in those jobs, and is responsible for the hard work of encoding stuff.

The `sisyphus-frontend` is a single page web application that shows the status of the server, workers, and other information.

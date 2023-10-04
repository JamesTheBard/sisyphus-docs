---
sidebar_position: 1
description: What can you even do with this?
---

# Jobs and Tasks

Central to Sisyphus are encoding jobs.  Jobs get put onto the queue, and jobs are what the encoding clients poll the API server for.  Each job is composed of one or more individual tasks and when a client picks up a job, they run the tasks defined in the job in the order they are defined in the task.

## Structure

A job is simply the job name, and a list of task objects.  Each task loads a module, and then the data associated with the task gets sent to the module.  The example below is a simple skeleton of a job.

```json
{
    "job_name": "Awesome Encoding Job",
    "tasks": [
        {
            "module": "ffmpeg",
            "data": {}
        },
        {
            "module": "mkvmerge",
            "data": {}
        }
    ]
}
```

## Adding a Job to the Queue

Once the job JSON has been created, you can add it to the queue via a POST call to the `/queue` route.  A job ID gets assigned to the job, the job information provided via the POST call is submitted to the appropriate queue, and the job ID is added to the `queue` key in Redis.

## Polling the Queue

When grabbing a job off of the queue, the first job ID is popped off of the Redis job queue, then the MongoDB is queried for the job information via the job ID.  This information is returned to the client so that it can start working on the job.

## Validation

When the client runs each task, the data gets validated before anything happens.  Some modules have in-depth JSON schemas associated with them that will identify most of the errors with the data in the task.

Since the client can load information from the server for some modules, data for each task is validated when the task module is loaded by the client, but before the actual task is run.

---
sidebar_position: 2
---

# Jobs and Tasks

Central to Sisyphus are encoding jobs.  Jobs get put onto the queue, and jobs are what the encoding clients poll the API server for.  Each job is composed of one or more individual tasks and when a client picks up a job, they run the tasks defined in the job in the order they are defined in the task.

## Job Structure

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

Every job contains a set of one or more tasks.  Each task gets processed in the order they are defined in the job.  The following information details the steps a task goes through when being run.

```json title="Task Skeleton"
{
    "module": "ffmpeg",
    "data": {}
}
```

## Data

All of the information to be passed into the module is held in the `data` attribute.  When a task is being run, the contents of the `data` attribute are passed directly to the module being loaded.

## Task Module

Every task has an associated module.  The steps that are run are the same for every module.  Below is a brief description of every step with respect to running a task module.

### Initialization

The first thing that happens with a task is being processed is that the associated module is loaded with the `data` being passed to it.  If there are any issues during initialization, the module with throw an error and the job will fail.  This will be something like the `ffmpeg` module being unable to find the `ffmpeg` binary on the system.

### Validation

When the client runs each task, the data that was passed gets validated before anything happens.  Some modules have in-depth JSON schemas associated with them that will identify most of the errors with the data in the task.

Since the client can load information from the server for some modules, data for each task is validated when the task module is loaded by the client, but before the actual task is run.

### Running the Task

After validation, the task starts by calling the `run()` method.

### Cleanup

Tasks can perform cleanup actions after the task has been run.  This is separate from the `cleanup` module.


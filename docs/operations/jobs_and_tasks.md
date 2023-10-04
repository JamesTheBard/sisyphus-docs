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

## Job Example

### Server Side Data

```json title="Ffmpeg Option Set: x265-dark-and-stormy"
{
  "name": "x265-dark-and-stormy",
  "options": {
    "codec": "libx265",
    "crf": 19,
    "pix_fmt": "yuv420p10le",
    "preset": "slow",
    "x265-params": {
      "limit-sao": 1,
      "bframes": 8,
      "psy-rd": 1,
      "psy-rdoq": 2,
      "aq-mode": 3
    }
  }
}
```

```json title="Ffmpeg Option Set: opus-128k-stereo"
{
  "name": "opus-128k-stereo",
  "options": {
    "codec": "libopus",
    "b": "128k",
    "ac": 2,
    "vbr": "on",
    "compression_level": 10,
    "application": "audio"
  }
}
```

### Submitted Job

```json title="Submitted Job Example"
{
  "job_title": "{{ job_title }}",
  "tasks": [
    {
      "module": "ffmpeg",
      "data": {
        "sources": [
          "{{ source_file }}"
        ],
        "source_maps": [
          {
            "source": 0,
            "specifier": "v",
            "stream": 0
          },
          {
            "source": 0,
            "specifier": "a",
            "stream": 2
          },
          {
            "source": 0,
            "specifier": "a",
            "stream": 0
          },
          {
            "source": 0,
            "specifier": "s",
            "stream": 0
          },
          {
            "source": 0,
            "specifier": "s",
            "stream": 1
          }
        ],
        "output_maps": [
          {
            "specifier": "v",
            "stream": 0,
            "option_set": "x265-dark-and-stormy"
          },
          {
            "specifier": "a",
            "stream": 0,
            "option_set": "opus-128k-stereo"
          },
          {
            "specifier": "a",
            "stream": 1,
            "option_set": "opus-128k-stereo"
          },
          {
            "specifier": "s",
            "stream": 0,
            "options": {
              "codec": "copy"
            }
          }
        ],
        "output_file": "output_file.mkv",
        "overwrite": true
      }
    },
    {
      "module": "mkvmerge",
      "data": {
        "sources": [
          {
            "filename": "output_file.mkv"
          }
        ],
        "tracks": [
          {
            "source": 0,
            "track": 0,
            "options": {
              "language": "eng",
              "default-track": "yes",
              "track-name": "{{ video_title }}"
            }
          },
          {
            "source": 0,
            "track": 1,
            "options": {
              "language": "jpn",
              "default-track": "yes",
              "track-name": "Stereo (OPUS)"
            }
          },
          {
            "source": 0,
            "track": 2,
            "options": {
              "language": "eng",
              "default-track": "no",
              "track-name": "Stereo (OPUS)"
            }
          },
          {
            "source": 0,
            "track": 3,
            "options": {
              "language": "eng",
              "default-track": "yes",
              "track-name": "Subtitles"
            }
          }
        ],
        "output_file": "{{ output_file }}",
        "options": {
          "no-global-tags": null,
          "no-track-tags": null,
          "title": "{{ video_title }}"
        }
      }
    },
    {
      "module": "cleanup",
      "data": {
        "move": [
          {
            "source": "{{ output_file }}",
            "destination": "/mnt/public_share/Done/{{ output_file }}"
          }
        ],
        "delete": [
          "output_file.mkv"
        ]
      }
    }
  ]
}
```

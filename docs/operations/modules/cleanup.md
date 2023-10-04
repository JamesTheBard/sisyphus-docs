---
description: Clean up residual files from previous tasks.
---

# `cleanup` Module

The `cleanup` module is very simple: it allows you to move and delete files.  Since there may be many temporary files in a given job, this is useful to make sure you don't run out of free space on your clients.

```json title="Task Skeleton"
{
  "delete": [],
  "copy": [{}],
  "move": [{}]
}
```

## Data Breakdown

### Delete

```json
[
  "temp_file_01.mkv",
  "temp_file_02.mkv"
]
```

This is a list of files to delete.  The module will attempt to delete them.  If it cannot, then it will error out.

### Copy

```json
[
  {
    "source": "finished_file.mkv",
    "destination": "/shared/finished_file.mkv"
  }
]
```

Copy the `source` file to `destination`.  The module will attempt to copy the file to the destination, but will throw an error if it cannot copy the file.

### Move

```json
[
  {
    "source": "finished_file.mkv",
    "destination": "/shared/finished_file.mkv"
  }
]
```

Basically the same thing as `copy`, but the source file is moved instead of being copied to the destination.

## Server-Side Data

This module does not use any server-side data.

## Full Example

```json
{
  "delete": [
    "temp_file_01.mkv",
    "temp_file_02.mkv"
  ],
  "copy": [
    {
      "source": "cool_file_01.mkv",
      "destination": "/shared/filesystem/cool_file.mkv"
    }
  ],
  "move": [
    {
      "source": "cool_file_01.mkv",
      "destination": "/shared/filesystem/cool_file.mkv"
    }
  ]
}
```
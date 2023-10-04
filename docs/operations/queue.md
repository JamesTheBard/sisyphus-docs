---
sidebar_position: 2
description: What can you even do with this?
---

# The Queue

## Adding a Job to the Queue

Once the job JSON has been created, you can add it to the queue via a POST call to the `/queue` route.  A job ID gets assigned to the job, the job information provided via the POST call is submitted to the appropriate queue, and the job ID is added to the `queue` key in Redis.

The job information needs to be passed in the body as type `application/json` when adding a job to the queue.

## Polling the Queue

When grabbing a job off of the queue, the first job ID is popped off of the Redis job queue, then the MongoDB is queried for the job information via the job ID.  This information is returned to the client so that it can start working on the job.

## Clearing the Queue

If something goes horribly wrong, you can clear the entire queue via a DELETE call to the `/queue` route.  This will clear the Redis `queue` linked list and delete all job information from the queued jobs.

## Disable the Queue

If you want to halt all workers from processing jobs on the queue, you can disable the queue via a PATCH call to the `/queue` route.  In the body, you'll need to set the `disabled` attribute to `true`.

```json title="JSON Body"
{
  "disabled": true
}
```

To enable the queue again, just send another PATCH call and change `disabled` to `false`.


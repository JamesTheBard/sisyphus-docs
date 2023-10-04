---
sidebar_position: 3
---

# Workers

:::note

The terms _worker_ and _client_ are used interchangably as they're the same thing.

:::

## Worker Operations

Workers poll the queue frequently, and they send a heartbeat message back to the API server to verify that they're still online, and to convey their current status.

### Worker Status

Each worker reports its status back via a POST call to the `/workers/{worker_id}` endpoint where the `worker_id` is the UUID associated with the worker.

To retrieve the current worker status, you can call the same endpoint via a GET call.

To get all worker statuses in a single call, you can use the `/workers` endpoint via a GET call.  This will return every online worker's status.

### Worker Queue Access

You can also enable or disable an individual worker's access to the queue via a PATCH call to the `/workers/{worker_id}` endpoint where the `worker_id` is the UUID associated with the worker.

In the body of the request, you will need to set the `disabled` attribute to `true`.

```json title="JSON Body"
{
  "disabled": true
}
```

To enable the worker's access to the queue, simple send another PATCH request and set `disabled` to `false`.
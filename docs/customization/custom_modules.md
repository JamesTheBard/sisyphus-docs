---
sidebar_position: 5
description: Writing a new Sispyhus client module...
---

# Module Development

Writing custom modules for the Sisyphus client is fairly easy.  Each module inherits from a Base module that will take care of setting up the heartbeat, importing the task, and defining all the required methods:

:::caution

This documentation applies to the `sisyphus-client` version `1.4.0` or greater.  While much of this applies to previous versions, the way that modules from tasks are handled changed significantly.  All modules are initialized and validated before running any of the `run` methods whereas they were run only when the client got to the task in previous versions.

:::

```python title="BaseModule Definition"
from app.config import Config
from app.exceptions import (RunError, InitializationError,
    ValidationError, CleanupError)

class BaseModule:
    """The base Sisyphus module for tasks.

    Attributes:
        heartbeat (Heartbeat): The heartbeat object for sending status back to the API server
        task (Box): The data that contains the task information to run from the job
        start_time (datetime): The time the module was initialized (task start time)
    """
    heartbeat: Heartbeat
    task: Box
    start_time: Optional[datetime]

    def __init__(self, task: Union[dict, Box]):
        """Initializes the instance based on task information.

        Args:
            task (Union[dict, Box]): The task data from the main job

        Raises:
            InitializationError: An error occured when initializing the module.
        """
        self.heartbeat = heartbeat
        self.task = Box(task)
        self.start_time = None

    def validate(self) -> None:
        """Validates the task data before execution.

        Raises:
            ValidationError: An error occured when attempting to validate the data.
        """
        logger.info("No validation actions, skipping")

    def run(self) -> None:
        """Run the task.

        Raises:
            RunError: An error occured when running the module.
        """
        self.set_start_time()
        logger.info("No run actions, skipping")

    def cleanup(self) -> None:
        """Perform cleanup tasks associated with the module.

        Raises:
            CleanupError: An error occured when cleaning up after module execution.
        """
        pass

    def get_duration(self) -> datetime:
        """Return the amount of time the module has run since it started.

        Returns:
            datetime: The time elapsed since module start
        """
        return datetime.now(tz=Config.API_TIMEZONE) - self.start_time

    def set_start_time(self) -> None:
        """Set the start time of the module.
        """
        self.start_time = datetime.now(tz=Config.API_TIMEZONE)
```

## Heartbeat

The heartbeat is responsible for sending progress and status information back to the API server.  This message is sent every few seconds and uses the `set_data` method to update the status information of a client.

### Status Message Format

The base module contains the client heartbeat object.  This is used to pass the status of the current task back to the API server.  The only required bits of information are the `status` and `task` attributes, and `status` should be set to `in_progress`.  The `task` attribute should be the same as the `module` attribute in the task section in the job.

```json title="Example of Heartbeat Status Message"
{
  "status": "in_progress", // Should be set by module, required
  "online_at": "string",   // Already set
  "hostname": "encoder01", // Already set
  "version": "string",     // Already set
  "task": "ffmpeg",        // Should be set by module, required
  "job_id": "00000000-1111-2222-3333-444444444444", // Already set
  "job_title": "Title",    // Already set
  "progress": 3.74,        // Should be set by module, optional
  "info": {}               // Should be set by module, optional
}
```

### Status and Task

For example, when writing the `__init__` method, make sure that the heartbeat status and task information is set correctly.  It's also recommended to add logging messages for the module loading successfully and a debug message for the task information.

```python title="Generic Custom Module Init Method"
from box import Box

class MyCustomModule(BaseModule):
    def __init__(self, task):
        super().__init__(task)
        logger.info("Module loaded successfully.")
        logger.debug("Data: {self.task}")
        self.status = Box({
            "status": "in_progress",
            "task": "mycustommodule"
        })
        self.heartbeat.set_data(self.status)
```

### Progress

Progress is simple: set the `progress` attribute to a number between 0 and 100.  This isn't required as some processes don't have a way to track the overall completion.

```python title="Generic Custom Module Run Method"
from box import Box

class MyCustomModule(BaseModule):
    def run(self) -> None:
        ...
        self.status.progress = 43
        self.heartbeat.set_data(self.status)
        ...
```

### Information

Information can be included in the status message using the `info` attribute.  There are no requirements on what can go into this field.  For example, the `ffmpeg` module will pass the current frame that's being worked on along with the total number of frames associated with the video file being processed.

```python title="Generic Custom Module Run Method"
from box import Box

class MyCustomModule(BaseModule):
    def run(self) -> None:
        ...
        self.status.progress = 43
        self.status.info = {
            current_frame = 197
            total_frames = 24067
        }
        self.heartbeat.set_data(self.status)
        ...
```

## Methods

When processing a task, the client will call four methods: the standard `__init__` method when the module is called for the task, the `validate` method, the `run` method, then the `cleanup` method.

### Initialization

If there is any data pre-processing or general "do stuff before validation", it should go in the `__init__` or as a method called by `__init__`.  

Any errors or exceptions must be caught in this method.  The only exception that should be thrown in the module initialization section is the `InitializationError` exception.

```python
from app.exceptions import InitializationError

# Something bad happened, so let's tell the world about it.
raise InitializationError(message="Could not build additional pylons.")
```

### Validate

All task data validation happens here.  This is called at the beginning of the job run, and there is no guarantee that any files from previous runs will exist when this happens.  Validation and initialization occur for every module before any task's `run` methods are called.

Secondly, any errors or exceptions must be caught in this method.  The only exception that should be thrown in a `validate` call is the `ValidationError` exception.

```python
from app.exceptions import ValidationError

# Something bad happened, so let's tell the world about it.
raise ValidationError(message="Your data is bad and you should feel bad.")
```

### Run

After all of the modules defined in all of the tasks are initialized and their data validated, the client's processing loop starts running the `run` method on each task's module in order (serially).  All of the initialization/validation happens first for all modules because the `run` method tends to be the longest running method for any module.

Since client version `1.4.0`, the modules all get initialized at the same time.  This requires adding a method call to set the start time (`self.set_start_time()`) when running the module as it used to live in the `__init__` method.

:::caution

Failure to add the `self.set_start_time()` call in the `run()` method may lead to undesireable effects like the client eating itself.

:::

```python
class CoolCustomModule(BaseClass):
    def run(self) -> None:
        self.set_start_time()
        # insert run code here
```

As with previous methods, the `run` method must catch and handle all exceptions.  The only exception that should be thrown is a `RunError` exception which the client will handle gracefully.

```python
from app.exceptions import RunError

# Another something bad happened.
raise RunError(message="Something bad happened, but on a side-note: let me tell you about my poetry...")
```

### Cleanup

The last method called is the `cleanup` method.  This allows the module to clean up any temporary files and directories before finishing the task.

As a final note: this method should catch and handle all exceptions.  The only exception that should be thrown is a `CleanupError` exception which the client will handle and be very frustrating because it caused the job to fail after doing all the heavy lifting.

```python
from app.exceptions import CleanupError

# This exception hurts the most, especially after a 2 hour
# `ffmpeg` run
raise CleanupError(message="Couldn't delete a temporary file and now it's your problem.")
```

### Other Considerations

It's also recommended for each of those methods that a informational logging message is produced to show if the method completed successfully.  The `BaseModule` has examples of the logging message to use at the end of each method.

The logging package used by Sisyphus is `loguru` and is part of the dependencies listed in the `pyproject.toml` file.

## Server-Side Data

The API server can store and retrieve data for a module and make that data available for all clients connected to the server.

The `ffmpeg` module will pull sets of options from the API server which means that every client can use the same encoding settings without having to define them every time in the task data.

To grab information from the API server:

```python
import requests
from app.config import Config

# To get the data
task_module = "ffmpeg"
data_name = "x265-veryfast"

# The GET request equivalent URL:
# http://address.to.api.server:5000/data/ffmpeg/x265-veryfast
requests.get(f"{Config.API_URL}/data/{task_module}/{data_name}")

# To push data to the server:
data_to_send = {
    "options": {
        "codec": 'libx265',
        "crf": 19,
        "preset": 'veryfast'
    }
}
requests.post(
    f"{Config.API_URL}/data/{task_module}/{data_name},
    data=data_to_send
)
```

## Enabling a Module

In the `pyproject.toml` file, there is a section called `tool.client.modules.enabled`.  This allows for modules that aren't being used to be disabled, and allows for adding available modules to the client.

```toml title="Default Module Configuration"
[tool.client.modules.enabled]
ffmpeg     = "modules.ffmpeg.Ffmpeg"
mkvmerge   = "modules.mkvmerge.Mkvmerge"
mkvextract = "modules.mkvextract.Mkvextract"
cleanup    = "modules.cleanup.Cleanup"
```

As an example, if you've added another module to `app.modules`, created the `cool.py` file and called the class `CoolModule`, then you'd add it in the following example.  Failing to do this will cause the client to never find the module and the job will fail.

```toml
cool       = "modules.cool.CoolModule"
```

```python title="Python Equivalent"
from app.modules.cool import CoolModule
```

## Disabling a Module

To disable a module, ensure that it is not in the `pyproject.toml` file under `tool.client.modules.enabled`.  If it's not there, then it can't be loaded directly.

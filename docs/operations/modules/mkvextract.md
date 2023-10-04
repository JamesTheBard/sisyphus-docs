---
description: Easily extract information from a source file.
---

# `mkvextract` Module

The `mkvextract` module can extract one or more tracks, attachments, chapters, tags, timestamps, or cues from a source file and save them to file.  This can be useful to process specific parts of a video before muxing or encoding them.

```json title="Task Skeleton"
{
  "source": "",
  "tracks": [{}],
  "attachments": [{}],
  "chapters": "",
  "tags": "",
  "timestamps": [{}],
  "cues": [{}]
}
```

## Data Breakdown

### Sources

The `source` attribute takes one file that will be the source file to extracting information from.

### Tracks

:::caution

Matroska specifiers (seen here as `track_type`) are full words like `video`, `audio`, or `subtitles`.  This is unlike Ffmpeg which uses single characters.

:::

```json
[
  {
    "id": 0,
    "track_type": "subtitles",
    "language": "jpn",
    "filename": "subtitles.ass"
  }
]
```

The `id` attribute is a zero-indexed number and specifies which track from the source to dump to `filename`.  If the `track_type` attribute is provided, then `id` specifies the _nth_ track of type `track_type`.  If `language` is also provided, then `id` will specify the _nth_ track of type `track_type` and language `language`.

In the example above, `mkvextract` will dump the first Japanese subtitle track and save it as `subtitles.ass`.

### Attachments

```json
[
  {
    "id": 0,
    "filename": "cool_font.ttf"
  }
]
```

The `attchments` attribute will dump the _nth_ attachment of the source file and save it as `filename`.

:::note

There is currently no method or option to dump all attachments to the filesystem from the source file.

:::

### Chapters

Dump the chapter information of the source file and save it to `chapters`.

### Tags

Dump all the tag information of the source file and save it to `tags`.

### Timestamps

```json
[
  {
    "id": 0,
    "filename": "timestamp.txt"
  }
]
```

Extract the _nth_ timestamp information (`id`) from the source file and save it as `filename`.

### Cues

```json
[
  {
    "id": 0,
    "filename": "cue_information.txt"
  }
]
```

Extract the _nth_ set of cue information (`id`) from the source file and save it as `filename`.

## Server-Side Data

This module does not use server-side data.

## Full Example

```json
{
  "source": "source_file.mkv",
  "tracks": [
    {
      "id": 0,
      "track_type": "subtitles",
      "language": "jpn",
      "filename": "subtitles.ass"
    }
  ],
  "attachments": [
    {
      "id": 0,
      "filename": "cool_font.ttf"
    }
  ],
  "chapters": "chapters.xml",
  "tags": "tags.xml",
  "timestamps": [
    {
      "id": 0,
      "filename": "timestamps_v2.txt"
    }
  ],
  "cues": [
    {
      "id": 0,
      "filename": "cue_information.txt"
    }
  ]
}
```
---
description: Mux files together into the Matroska container.
---

# `mkvmerge` Module

:::tip

To really use this module, it's strongly recommended to be familiar with `mkvmerge` command-line options.  For more information, refer to the [Matroska `mkvmerge` documentation](https://mkvtoolnix.download/doc/mkvmerge.html).

:::

The `mkvmerge` module allows for muxing multiple files together into a single Matroska file.  This includes multiple source files, per-track muxing to include options, global options, and attachment support.

```json title="Task Skeleton"
{
    "sources": [{}],
    "tracks": [{}],
    "options": {},
    "attachments": [{}],
    "output_file": ""
}
```

## Data Breakdown

### Sources

```json
[{
    "filename": "source_file.mkv",
    "options": {
        "no-chapters": null,
        "_copy-video-tracks": null
    }
}]
```

Each `sources` entry requires the `filename` attribute.  By default, this module does not copy all video, audio, or subtitle tracks to the output file.  In the example above, the `_copy-video-tracks` option in the `options` attribute tells `mkvmerge` to copy all video tracks over to the output file.  

The full set of copy options are:
- `_copy-video-tracks`: Copy all video tracks present in the source file.
- `_copy-audio-tracks`: Copy all audio tracks present in the source file.
- `_copy-subtitles-tracks`: Copy all subtitle tracks present in the source file.

For options defined with a value of `null`, this means to include the option but without setting it to a value.  This is specifically for options like `--no-chapters` where a value is neither desired nor required.

### Tracks

```json
[{
    "source": 0,
    "track": 0,
    "options": {
        "language": "und",
        "default-track": "yes",
        "track-name": "Awesome Newly Muxed Video"
    }
}]
```

Tracks are zero-indexed, and there is currently no specifier support.  The `source` attribute identifies which source to use (zero-indexed) and the `track` is which track to use from that source (also zero-indexed).

The `options` specify information pertaining to the track in question.  These settings include things like the title of the track, the language of the track, and specific track flags like being forced or being the default track.

### Options

```json
{
    "no-global-tags": null,
    "no-track-tags": null,
    "title": "Awesome Newly Muxed Video"
}
```

The `options` attribute is for global flags.  In the example above, it sets the `--no-global-tags` and `--no-track-tags` options and sets the title of the resulting Matroska file to _Awesome Newly Muxed Video_.

This is not to be confused with the `options` attribute as part of the `sources` and `tracks` sections.

### Attachments

```json
[{
    "name": "Cool Open Source Font",
    "filename": "open_source_font.otf",
    "mime_type": "application/vnd.ms-opentype"
}]
```

The `attachments` attribute allows for the attachment of files such as fonts to the resulting Matroska file.  The `filename` is the file to be attached.  The `name` attribute is optional, and will default to the `filename` if not defined.

The `mime_type` option is required _unless you are attaching a TrueType or OpenType font_!  The attachment system has predefined MIME-types for both of those.  However, for any other type of file you must add a MIME-type.

### Output File

This is the file to save the muxed video to.

## Server-Side Data

This module does not use server-side data.

## Full Example

```json
{
  "sources": [
    {
      "filename": "/mnt/server/cool_video_file_with_eng_audio.mkv",
      "options": {
        "no-chapters": null
      }
    },
    {
      "filename": "/mnt/server/cool_audio_file_jpn.ac3"
    },
    {
      "filename": "/mnt/server/subtitles_full_eng.ass"
    }    
  ],
  "tracks": [
    {
      "source": 0,
      "track": 0,
      "options": {
        "language": "und",
        "default-track": "yes",
        "track-name": "Awesome Newly Muxed Video"
      }
    },
    {
      "source": 1,
      "track": 0,
      "options": {
        "language": "jpn",
        "default-track": "yes",
        "track-name": "Dolby Digital 5.1"
      }
    },
    {
      "source": 0,
      "track": 1,
      "options": {
        "language": "eng",
        "default-track": "no",
        "track-name": "Stereo 2.0"
      }
    },
    {
      "source": 2,
      "track": 0,
      "options": {
        "language": "eng",
        "default-track": "yes",
        "track-name": "Full Subtitles"
      }
    }
  ],
  "options": {
    "no-global-tags": null,
    "no-track-tags": null,
    "title": "Awesome Newly Muxed Video"
  },
  "attachments": [
    {
      "name": "Cool Open Source Font",
      "filename": "test.ttf",
      "mime_type": "application/x-truetype-font"
    }
  ],
  "output_file": "/mnt/server/awesome_newly_muxed_video.mkv"
}
```
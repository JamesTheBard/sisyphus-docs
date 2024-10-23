---
description: Encode video and audio files.
---

# `ffmpeg` Module

:::tip

To really use this module, it's recommended to be familiar with Ffmpeg command-line options and the concept of source maps.  For more information, refer to [Ffmpeg's documentation](https://ffmpeg.org/ffmpeg.html) on the `-map` option along with specific encoder and track options.

:::

:::caution

Ffmpeg specifiers are single characters like `s` and `a`. These are different than those used by Matroska which uses full words.

:::

The `ffmpeg` module allows for multiple input sources to be defined.  From there you can specify the mapping of those sources via source maps, then specify the options to process each of the resulting tracks from that mapping.  Finally, you specify the output file where everything gets encoded and muxed to.

There are limitations to this file.  All tracks must be specified via the source map, so the processing of all tracks of a given source file is not supported at this time.  For more information, reference the [`sisyphus-ffmpeg` module](https://github.com/JamesTheBard/sisyphus-ffmpeg) documentation.

```json title="Task Skeleton"
{
  "input_options": {},
  "sources": [],
  "source_maps": [{}],
  "output_maps": [{}],
  "output_file": "",
  "overwrite": true
}
```

## Data Breakdown

### Input Options

:::info

Available starting in Sisyphus client version **1.5.6** and above!

:::

These are the options that are added _before_ the sources/input files in the `ffmpeg` command. For example, carving a 10 minute chunk out of the inputs starting at the 10 minute mark could be done like this:

```json
{
  "ss": "0:10:00",
  "to": "0:20:00"
}
```

### Sources

```json
[
  "input_file_01.mkv",
  "input_file_02.ac3"
]
```

### Source Maps

```json title="Source Map Example"
[
  {
    "source": 0,
    "specifier": "a",
    "stream": 2
  }
]
```

```json title="Generated Command Options"
-map 0:a:2
```

This mapping is comprised of three things: the `source` which is the _nth_ source listed in the sources (starting with zero).

The `specifier` which is a single letter that tells Ffmpeg what kind of track you are referencing in the `source` attribute.  For example, `v` is video, `s` is subtitles, `a` is audio.  When using a specifier, this changes how tracks are addressed.  Instead of the _nth_ track of that source (when a specifier isn't used), it specifies the _nth_ track of that type.  In the example, the map is specifying the third audio track in the first source. 

The `stream` is which stream/track you want to use.  If there is no specifier, then it's the _nth_ track from the `source`.  If there is a specifier, then the stream/track specified is the _nth_ track of that type.

### Output Maps

```json title="Output Map Example"
[
  {
    "specifier": "v",
    "stream": 0,
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
]
```

```console title="Generated Command Options"
-codec:v:0 libx265 -crf:v:0 19 -pix_fmt:v:0 yuv420p10le -preset:v:0 slow \
-x265-params:v:0 limit-sao=1:bframes=8:psy-rd=1:psy-rdoq=2:aq-mode=3
```

Each output map can specify a `specifier` for a given type of track (just like source maps), and a stream number via the `stream` attribute.  Instead of referencing the source files, this references the resulting map from the source map.  The example would reference the first video track _after_ the source maps.  This basically means the first video track pulled from the sources via the source maps.

The options defined for a given track are the CLI options and definitions for a given track and are defined by what encoder is being used and the track type.  For more information about those, reference the [Ffmpeg documentation](https://ffmpeg.org/ffmpeg.html).

### Output File

The attribute `output_file` just tells Ffmpeg where to save the resulting file to.

### Overwrite

The attribute `overwrite` tells Ffmpeg to overwrite the `output_file` if it already exists.

## Server-Side Data

### Option Sets

The full example below shows two scenarios.  The video output map shows all of the `ffmpeg` options being defined in the `output_maps` section.  The audio output map shows what is called an `option_set`.  This allows for sets of options to be defined on the API server for use by all connected clients.

The `opus-128k-stereo` option set (as an example) could be defined on the server as defined below.  The data gets pulled from the API server via the `/data/ffmpeg/opus-128k-stereo` route.  Then the options section gets placed over any options already defined in that output map.  If the default settings for the API server are used, this would be in the `sisyphus_data` database as part of the `data_ffmpeg` collection.

:::info

Option sets are only available for use in an option map.

:::

```json title="Opus 128k Stereo Option Set"
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

These data sets can be defined either directly in the Mongo database or via the `/data/ffmpeg/{option-set-name}` route via the API server.

## Full Example

The example below takes two files as inputs via the `sources` section.

The source maps tell Ffmpeg to use the first video track and first subtitle track from `source_file_1.mkv` and the first audio track from `source_file_2.ac3` (which conveniently only has one audio track as it's an audio file).

From there, the first output map looks for the first video track we specified and uses the `libx265` encoder to encode the track.  The second output map uses the first audio track defined in the source maps to encode it to `opus`.  The third output map uses the first subtitle track defined in the source maps to copy the subtitles into the final file.

The `output_file` is defined as `/shared/output_file.mkv` which will be overwritten if it already exists (via the `overwrite` attribute).

```json title="Full Example"
{
  "input_options": {
    "ss": "0:10:00",
    "to": "0:20:00"
  },
  "sources": [
    "source_file_1.mkv",
    "source_file_2.ac3"
  ],
  "source_maps": [
    {
      "source": 0,
      "specifier": "v",
      "stream": 0
    },
    {
      "source": 1,
      "specifier": "a",
      "stream": 0
    },
    {
      "source": 0,
      "specifier": "s",
      "stream": 0
    }
  ],
  "output_maps": [
    {
      "specifier": "v",
      "stream": 0,
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
    },
    {
      "specifier": "a",
      "stream": 0,
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
  "output_file": "/shared/output_file.mkv",
  "overwrite": true
}
```

```bash title="Generated Command"
/path/to/ffmpeg -y -ss 0:10:00 -to 0:20:00 -progress pipe:1 \
-i "source_file_1.mkv" -i "source_file_2.ac3" \
-map 0:v:0 -map 1:a:0 -map 0:s:0 \
-codec:v:0 libx265 -crf:v:0 19 -pix_fmt:v:0 yuv420p10le -preset:v:0 slow \
-x265-params:v:0 limit-sao=1:bframes=8:psy-rd=1:psy-rdoq=2:aq-mode=3 \
-codec:a:0 libopus -b:a:0 128k -ac:a:0 2 -vbr:a:0 on -compression_level:a:0 10 -application:a:0 audio \
-codec:s:0 copy "/shared/output_file.mkv"
```

:::note

The `-progress pipe:1` is required for the client to capture progress information.

:::
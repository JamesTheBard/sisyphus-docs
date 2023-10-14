---
description: Encode video and audio files, but differently than Ffmpeg.
---

# `handbrake` Module

**Available in `sisyphus-client` Version 1.5.0**

:::tip

To really use this module, it's highly recommended to be familiar with the HandBrakeCLI [command-line options documentation](https://handbrake.fr/docs/en/latest/cli/command-line-reference.html).  The way options are broken out follows it very closely.

:::

The `handbrake` module takes a source, an output file, and from there you can add as many options as the `HandBrakeCLI` binary will allow to encode basically anything.

There is full support for all options available (that make sense), and it should be fairly straight-forward to use.

:::note

The _General Options_ of HandBrake were not implemented as they're of limited use generally.

:::

```json title="Task Skeleton"
{
  "source": "",
  "output_file": "",
  "source_options": {},
  "destination_options": {},
  "video_options": {},
  "audio_options": {},
  "picture_options": {},
  "filters_options": {},
  "subtitles_options": {}
}
```

## Data Breakdown

:::caution

Failure to read this section will cause significant pain and swearing.

:::

For each option in HandBrake's documentation, there are some small changes that were made in the sake of consistency.

1. All options that had dashes in their names were changed into underscores, and all options are references without their leading dashes.  For example, in the _Source Options_ section, the option `--start-at` was changed to `start_at`.

2. All options that were camel-cased were changed to be lowercased and to use underscores as well.  For example, in the _Picture Options_ section, the option `--maxHeight` was changed to `max_height`.

3. This also includes custom filters in the _Filters Options_ section.  For example, when specifying a custom format for the `--comb-detect` option, this would be built like:

    ```json title="Custom Filter using Comb Detect Option"
    {
      "filters_options": {
        "comb_detect": {
          "mode": 3,
          "spatial_metric": 2,
          "motion_thresh": 1,
          "spatial_thresh": 1,
          "filter_mode": 2,
          "block_thresh": 40,
          "block_width": 16,
          "block_height": 16
        }
      }
    }
    ```

    ```bash title="Output for Comb Detect Option"
    --comb-detect mode=3:spatial-metric=2:motion-thresh=1:spatial-thresh=1:filter-mode=2:block-thresh=40:block-width=16:block-height=16
    ```

4. For options prefixed by `--no-`, these were removed as they weren't needed.  For example, instead of using `--no-comb-detect`, you would do the following:

    ```json title="Negating an Option"
    {
      "filters_options": {
        "comb_detect": false
      }
    }
    ```

    ```text title="Output"
    --no-comb-detect
    ```

### Source

This is just the path to the input file.  This is different than the `HandBrakeCLI` documentation as it would normally live under the `source_options` section.  However, it was pulled into its own root key/value pair to match the other modules.

### Output File

The `output_file` tells HandBrake where to save the output to.  Like the `source` option, it was also removed from the `destination_options` section into the root to match the way the other modules work.

### Options Sections

```json title="Option Sections"
{
  "source_options": {},
  "destination_options": {},
  "video_options": {},
  "audio_options": {},
  "picture_options": {},
  "filters_options": {},
  "subtitles_options": {}
}
```

All of these sections line-up with the HandBrake CLI documentation sections (available by running the command with the `-h` option). You can also view the documentation from [HandBrake's website](https://handbrake.fr/docs/en/latest/cli/command-line-reference.html).

## Server-Side Data

This module does not use server-side data.

## Full Example

```json title="Full Example"
{
  "source": "source_file.mkv",
  "output_file": "output_file.mkv",
  "video_options": {
    "encoder": "x265_10bit",
    "encoder_preset": "slow",
    "encopts": {
      "limit-sao": 1,
      "bframes": 8,
      "psy-rd": 1,
      "psy-rdoq": 2,
      "aq-mode": 3
    }
  },
  "audio_options": {
    "audio": [ 3, 1 ],
    "aencoder": [ "opus", "opus" ],
    "aname": [ "Stereo 2.0 (OPUS)", "Surround 5.1 (OPUS)" ],
    "ab": [ 128, 192 ],
    "mixdown": [ "stereo", "5_2_lfe" ]
  },
  "subtitles_options": {
    "subtitle": [ 2, 1 ],
    "subname": [ "Full Subtitles", "Signs and Songs" ],
    "subtitle_default": 1
  }
}
```

```bash title="Generated Command"
'/path/to/HandBrakeCLI' --input source_file.mkv --output output_file.mkv \
--encoder x265_10bit --encoder-preset slow --encopts limit-sao=1:bframes=8:psy-rd=1:psy-rdoq=2:aq-mode=3 \
--audio 3,1 --aencoder opus,opus --aname 'Stereo 2.0 (OPUS),Surround 5.1 (OPUS)' --ab 128,192 --mixdown stereo,5_2_lfe \
--subtitle 2,1 --subname 'Full Subtitles,Signs and Songs' --subtitle-default 1
```
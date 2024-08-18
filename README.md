# Interactive tutorial for AWK as SCORM

This repository contains scripts to wrap translated to Polish <https://n8ta.com/projects/awk.html> and <https://n8ta.com/projects/awk_intermediate.html> into SCORM 1.2 package. I use it to grade students' activity in Moodle.

The latest automatically built SCORM package can be downloaded from [Releases](https://github.com/andre-wojtowicz/awk-tutorial-scorm).

[Live demo](https://andre-wojtowicz.github.io/awk-tutorial-scorm/) with simple SCO run-time test environment (click "Launch SCO" in top-left corner).

## Moodle SCORM activity settings

```plaintext
Appearance:

    Display package:                        New window
    Width:                                  100%
    Height:                                 100%
    Options:                                [all unchecked]
    Student skip content structure page:    Always
    Disable preview mode:                   Yes
    Display activity name:                  [unchecked]
    Display course structure on entry page: No
    Display course structure in player:     Disabled
    Display attempt status:                 No

Grade:

    Grading method:                         Highest grade
    Maximum grade:                          1 (see notes below about adjusting)

Attempts management:

    Number of attempts:                     1
    Force new attempt:                      No
    Lock after final attempt:               No

Compatibility settings:

    Force completed:                        No
    Auto-continue:                          No
    Auto-commit:                            No
    Mastery score overrides status:         Yes
```

### Adjusting maximum grade

SCORM `cmi.core.score.max` value is set to `1`, so by default (as described in the section
above) *Maximum grade* should be set to `1`. If you want to give e.g. `6` points for this activity,
then change settings in:

1. the SCORM activity: `Grade > Maximum grade` to `6`;
2. Gradebook setup page the grade item related to the SCORM activity: `Grade item > Multiplicator` to `6`.

## Manual build

### Local GitHub Actions with Docker

Install [Docker](https://docs.docker.com/engine/install/ubuntu/), [act](https://github.com/nektos/act) and add `act` to `$PATH`. You can use *medium* Docker Ubuntu image.

```shell
$ git clone https://github.com/andre-wojtowicz/awk-tutorial-scorm.git
$ cd awk-tutorial-scorm
$ act -r -j build
$ docker cp act-Build-and-release-build:$(pwd)/dist .
$ docker container rm act-Build-and-release-build -f
$ ls dist/*.zip
```

### Ubuntu

Clone this repo :

```shell
$ git clone https://github.com/andre-wojtowicz/awk-tutorial-scorm.git
$ cd awk-tutorial-scorm
```

Build site:

```shell
$ make deps
$ make site
```

Build SCORM zip file in `dist` directory:

```shell
$ make scorm
```

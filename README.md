# [Brainstormer](https://brainstormer.app)

## Intro

Brainstormer is an open source brainstorming tools for online collaboration. It is designed to share different ideas between collaborators and keep iterate those ideas.

Brainstormer support 6 collaborators currently.

![screenshot](https://github.com/yujuiting/brainstormer/raw/main/misc/screenshot.png)

## Usage

![screenshot](https://github.com/yujuiting/brainstormer/raw/main/misc/demo.gif)

1. Type in display name and invite collaborators.

2. Storm your brain individually.

3. Present ideas one by one.

4. Group similar ideas and go into next iteration!.

## Develop

Launch client

```
$ yarn workspace client start
```

And launch server

```
$ yarn workspace server start
```

Or launch server via vscode debugger.

## Project structure

Brainstormer is a mono repo containing server and client.

- `packages/core` contains types and actions shared between server and client.

- `packages/client`

- `packages/server`

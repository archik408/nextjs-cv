---
title: An accelerometer as an alternative game control in a shooter
description: How my son and I made a shooter on the micro:bit — aiming with the accelerometer and firing on A+B — and then ported the kid-friendly MakeCode algorithm into a web game with 16-bit Sega vibes
date: 2026-10-22
tags: [microbit, makecode, games, accelerometer, web, programming, kids]
---

I had long wanted to build a really simple game example with my son on the [micro:bit](/garden/microbit-water-sensor_en) — a shooter that I [saw](https://makecode.microbit.org/74345-46449-94055-91646) in a themed book. Somehow my hands never got to it: where do you find the time for everything? But we finally did — one evening on a weekend.

![My son building the shooter game in MakeCode](/garden/microbit-striker/striker-1.webp)

It seems like, what can you possibly make on a screen of 5 by 5 LED lights? But the concept is very simple. We draw the enemy as a lit LED — absolutely random each time, just a dot at full brightness.

We draw the crosshair strictly in the center of the display and dim it a little, so the crosshair is less bright than the enemy dot — that way the two can be laid on top of each other.

We move the crosshair toward the enemy using the readings of the tilt sensor — the accelerometer. And we fire by pressing buttons A+B at the same time.

![The shooter project in MakeCode: the micro:bit simulator and the block algorithm](/garden/microbit-striker/striker-1-2.webp)

The microcontroller here acts as both the joystick and the game display. The project is done.

## From MakeCode — to the web

Next we fed the kid-friendly algorithm to an AI agent and asked it to produce something in the spirit of [16-bit Sega games](https://microbit-shooter-game.vercel.app/).

We also asked it to take the [micro:bit connector](/microbit-connector) implementation from [the solution](/garden/alice-microbit_en) I had built for controlling the board via the Yandex Alice Station.

![The web version of the shooter with 16-bit Sega console vibes](/garden/microbit-striker/striker-2.webp)

So in the [web version](https://microbit-shooter-game.vercel.app/) the easy path is playing with a computer keyboard: arrow keys and firing on the spacebar. But it's far more interesting and challenging to connect the microcontroller to the web game and steer the crosshair with the accelerometer, like a joystick — by analogy with that first kid-friendly MakeCode program.

![Web version gameplay: a starry sky, enemies and a crosshair](/garden/microbit-striker/game-screen.webp)

For a smartphone it can be done in a similar way if it supports the [Web Accelerometer API](https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer), with a D-Pad as a fallback where the API is missing — on iOS, for instance.

![A micro:bit in hands — a joystick for the web game](/garden/microbit-striker/striker-4.webp)

## From prototype to application

In short, just like [last time with the breathing app](/garden/vydokh-app_en), this turned into another 0-to-1 application case: from a lab prototype in kid-friendly MakeCode with blocks to a perfectly tangible web application.

### Related notes

- [Alice commands the micro:bit — building custom voice skills with my son](/garden/alice-microbit_en)
- [How my son and I built a watering sensor for a cactus, or why the micro:bit is the best first computer](/garden/microbit-water-sensor_en)
- [A small but complete PWA from 0 to 1, as an example for kids within the "do your :bit" challenge](/garden/vydokh-app_en)
- [A smart Christmas tree ornament on the micro:bit](/garden/umnya-elka-microbit_en)

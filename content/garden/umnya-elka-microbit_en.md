---
title: A smart Christmas tree ornament on the micro:bit
description: Building a Christmas ornament with music and light together with the kids, based on the micro:bit controller
date: 2025-12-23
tags: [microbit, programming, kids, christmas, electronics]
---

If it's a tree ornament, then only one like this!

![Two photos of the BBC micro:bit microcontroller. On the left, the board lies on a white keyboard with a USB cable, a battery pack and crocodile-clip wires attached. On the right, a close-up of a hand holding the same micro:bit, with a laptop running the programming environment and a notebook visible in the background. It all takes place indoors, on a wooden table.](/garden/microbit.webp)

It's Christmas Eve now, the holidays, and tree ornaments are sold everywhere. There's also a fashion for music boxes with Christmas tunes, usually from movies like "Home Alone" and "Harry Potter".

Long story short, I decided to combine it all and make a mega-super-duper smart ornament together with the kids — one that lights up, plays music, and hangs on the tree — all at once!

## The foundation — the micro:bit

The foundation is the [**micro:bit**](https://en.wikipedia.org/wiki/Micro_Bit) controller: super minimalistic, affordable and approachable.

It connects easily to the browser and is programmed in [**MakeCode**](https://www.microsoft.com/en-us/makecode) — a block-based programming language similar to [Scratch](https://scratch.mit.edu/). After Scratch, kids already know their way around it intuitively.

Very easy onboarding, and you can save the code as JavaScript or Python — in short, very simple and exactly what's needed.

If you're interested, I put the code of our implementation [here](https://github.com/archik408/test/blob/master/main.ts). You can paste it into the visual editor as is and convert it into kid-friendly blocks. And it turned out to be quite a lot of code!

![The online Microsoft MakeCode editor interface for the micro:bit. On the left is a virtual model of the micro:bit board with wires attached, and a Christmas tree LED animation is playing on the board's screen. On the right is a large number of code blocks arranged in columns, colored red and blue, pointing to a complex program logic. In the center of the screen there is a menu of block categories such as input, music, LEDs and variables. At the top, the browser navigation bar is visible, and at the bottom there is a button for downloading the program, with the project name "Merry Christmas".](/garden/makecode.webp)

## Melodies with AI

These days, implementing melodies with AI is quite easy. The main thing is to find the tablature or the notes of a tune and feed them to the chat. It converts them into sound codes reasonably well, although mine kept stubbornly missing the key.

"Jingle Bells", "Merry Christmas", "The Forest Raised a Christmas Tree" (a Russian carol) and "Harry Potter" came together almost immediately, while "Home Alone" had to be reworked by hand. To my ear, it still doesn't sound quite right.

Later we tied the pictures on the screen to a variable's value, matching each song.

## Creativity within constraints

The 5×5 LED limitation pushed me and the kids toward creativity — trying to fit and draw a Christmas tree, a present, a bell, a lightning bolt for Harry Potter and a little house for "Home Alone".

Here's a video of what came out of it! Watch with the sound on!

<video controls poster="/garden/microbit-cover.webp">
  <source src="/garden/microbit.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>

## For grown-up programmers

If you want to program a microcontroller the adult way, without kids' visual languages — in C++ or Rust — then go [here](https://github.com/archik408/awesome-microbit).

### Related notes

- [A small but complete PWA from 0 to 1, as an example for kids within the "do your :bit" challenge](/garden/vydokh-app_en)
- [An accelerometer as an alternative game control in a shooter](/garden/microbit-striker_en)
- [How my son and I built a watering sensor for a cactus, or why the micro:bit is the best first computer](/garden/microbit-water-sensor_en)
- [Alice commands the micro:bit — building custom voice skills with my son](/garden/alice-microbit_en)

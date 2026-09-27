---
title: 'Flux: Some things never change'
description: The English translation of an old note about MVC, Flux, Redux, and why unidirectional data flow is not as new as it seems.
date: 2018-02-14
tags: [javascript, react, redux, flux, architecture, seedling]
---

![Mary Evans Picture Library/Alamy — Ellis, R. 1994. Monsters of the Sea. Robert Hale Ltd.](/garden/flux-some-things-never-change/cover.webp)

_Mary Evans Picture Library/Alamy — Ellis, R. 1994. Monsters of the Sea. Robert Hale Ltd._

The English translation of my old Russian article, many thanks to [Anastasia Shitikova](https://www.linkedin.com/in/anastasia-shitikova-a5b3a6106/) for helping.

A kaleidoscope of frameworks and libraries which rule JavaScript trends by turns is not the news anymore. Developers from other fields even mock us, front-end developers.

I had to go through various libraries and frameworks — [qooxdoo](http://www.qooxdoo.org/), [jQuery](https://jquery.com/), [ExtJS](https://www.sencha.com/products/extjs/), [Backbone.js](http://backbonejs.org/), [Ember.js](https://www.emberjs.com/), [Angular](https://angularjs.org/), [React](https://reactjs.org/) in the process of my work.

The choice of this or that framework was not always voluntary. The outsource and outstaffing model imposes certain limits on my work. I think my colleagues will understand me.

The latest library which I have chosen is React from Facebook. I am not going to be secretive. I was not willing to switch to that library. It meant leaving my comfort zone which is exactly what we do not like. The large number of new words was scaring me, especially the “new” reinterpretation of architectural style by [Flux](https://facebook.github.io/flux/) and [Redux](https://redux.js.org/) and new terms — Actions, Store, Dispatcher etc.

You will agree that, given all the previous “hammers and nails”, the glossary was usually limited to something like Model-View-\* (Controller || Presenter || Adapter || ViewModel || Whatever).

My understanding of that glossary looked exactly like it does in this picture:

![The picture from the course “JavaScript Design Patterns”, of a rather popular MOOC-platform called Udacity](/garden/flux-some-things-never-change/mvc-kraken.webp)

_The picture from the course “[JavaScript Design Patterns](https://www.udacity.com/course/javascript-design-patterns--ud989)”, of a rather popular MOOC-platform called Udacity._

I liked that picture. It made it easier to perceive the world populated with heaps of clones and various MVC interpretations.

There is the View — [HTML](https://www.w3.org/html/), [CSS](https://www.w3.org/Style/CSS/) and everything connected with them. There is the Model — [JSON](http://www.json.org/)— the data and the place where we have taken them from. There is also the Kraken/ Octopus/ Wall-fern/ Multiarmed — which is some mythological creature that unites the data and views.

MVO is the answer to all of the questions.

![JavaScript Design Patterns: MVO](/garden/flux-some-things-never-change/mvo.webp)

_JavaScript Design Patterns: MVO_

Suddenly Facebook comes and [says](https://www.youtube.com/watch?v=nYkdrAPrdcw&feature=youtu.be&t=10m56s) (watch the video from 10:56): “MVC is a bad thing, you can get stuck in it and never get out of this network of dependencies”.

![Facebook MVC dependency spiderweb](/garden/flux-some-things-never-change/facebook-mvc.webp)

Then it [reports](https://www.youtube.com/watch?v=nYkdrAPrdcw&feature=youtu.be&t=19m36s) (watch the video from 19:36): there is a silver bullet — Flux and Unidirectional [Dataflow](https://facebook.github.io/flux/docs/in-depth-overview.html#content):

![Flux unidirectional dataflow](/garden/flux-some-things-never-change/flux-diagram.webp)

It then presents [the following information](https://youtu.be/1wbDxOAXZEk?t=10m35s): Flux is complicated; Redux is exactly what you need.

You are inclined to believe it for this is Facebook and these guys are competent. However, you are gradually swimming with the stream.

Everything is now solved by means of this architectural style and library. Do you need to develop front-end? Ok, let’s take React, Redux and a little luggage like thunk, saga, storybook, themr, flow — and that does it.

Oh no, do not think that React is a bad library. It is actually wonderful. I am excited by [Virtual DOM](https://reactjs.org/docs/faq-internals.html) technology, because it solves a very important task. Its connection to the programming reactive paradigm also makes me happy. However, this “new” architectural style…

Our field is rapidly developing which is great. There are hundreds of times more programmers in 2017 than in 1980. That is also great. New cool instruments have appeared which simplify the life of an application programmer . However, at the same time, application programmers have started to think less. At least that is how it seems to me. I have written a lot of second-rate and complicated code during my five years of professional programming.

I decided to stop for a while and rethink web-application development as Facebook had done. I decided to find out why the Unidirectional Dataflow solves this cobweb problem, why nobody has done it before Facebook, and what is wrong with MVC and all of its arrows going in all different directions.

I started in the reverse order.

### MVC

I started with having studied the definition that other top development companies have given to this architectural style. Most often we do exactly that: we watch how someone who is competent and carries weight does it.

Interpretation from Facebook

![Interpretation from Facebook](/garden/flux-some-things-never-change/facebook-interpretation.webp)

However, we are familiar with it. Watch the video [Hacker Way: Rethinking Web App Development at Facebook](https://www.youtube.com/watch?v=nYkdrAPrdcw) from 10:35.

Interpretation from Microsoft

![Source: https://msdn.microsoft.com/en-us/library](/garden/flux-some-things-never-change/microsoft-mvc.webp)

_Source: https://msdn.microsoft.com/en-us/library_

The Model and View are not connected invertedly, though it is clear from the description that the model responds to the status enquiry from the view anyway. In other words, the interpretation is the same as that of Facebook.

Interpretation from Apple

Those guys have two schemes: traditional and Cocoa API version.

![Source: developer.apple.com/library](/garden/flux-some-things-never-change/apple-mvc-1.webp)

_Source: developer.apple.com/library_

![Source: developer.apple.com/library](/garden/flux-some-things-never-change/apple-mvc-2.webp)

_Source: developer.apple.com/library_

Hm, interesting. The first variant looks confusing. The model is connected with the view bilaterally, like in the previous interpretations. But the connection with the controller is not unilateral. The user’s action goes through the view and to the controller.

In the second variant, the model and the view are not directly connected. Interconnection is performed by means of the controller, and it resembles the picture with the octopus.

Interpretation from Google.

![Source: developer.chrome.com](/garden/flux-some-things-never-change/google-mvc.webp)

_Source: developer.chrome.com_

The same kraken:

![Martin Fowler MVC scheme](/garden/flux-some-things-never-change/fowler-mvc.webp)

Below, there is a scheme from Martin Fowler’s blog.

![Source: https://martinfowler.com/eaaCatalog/modelViewController.html](/garden/flux-some-things-never-change/fowler-catalog.webp)

_Source: https://martinfowler.com/eaaCatalog/modelViewController.html_

Martin Fowler has a very interesting [series of articles](https://martinfowler.com/eaaDev/uiArchs.html) about the GUI architectures, where he describes his interpretation of MVC in detail.

Interpretation of MVC from Java

![Java MVC interpretation](/garden/flux-some-things-never-change/java-mvc.webp)

Below is a MVC interpretation from a neighboring world, such as Java. It is not a coincidence that I am familiar with JSP. My so-called shady past:)

Aren’t you confused? Do you remember the series called X-files? The truth is out there.

One thing is clear — all of the variants are similar and they all tell us about the same, but there is no dogma in the interpretation of Model-View-Controller. Why is this so? Apparently, the initial definition was not very precise. Or was it?

We often judge technology by its appearance. We take into consideration someone else’s interpretation, instead of finding out the primary source and forming our own opinion.

What is the primary source of MVC?

### The origins of MVC

It probably would have been worthwhile beginning the article with the same question that [Uncle Bob](https://blog.cleancoder.com/) [asks at his seminar](https://youtu.be/WpkDN78P884?t=14m15s): Do you know who he is?

![Trygve Reenskaug](/garden/flux-some-things-never-change/trygve.webp)

_Trygve Reenskaug_

This is Trygve Reenskaug, a professor at the University of Oslo. He is the creator of MVC and the first person to describe that architectural style. It was in 1978, during his visit to the Learning Research Group in the Xerox PARC that the foundation was laid for the basis of this concept for the project Dynabook, the analogue of the modern tablet.

The following quotation is attributed to him:

“MVC was conceived as a general solution to the problem of users controlling a large and complex data set. The hardest part was to hit upon good names for the different architectural components” ([Wikipedia](https://en.wikipedia.org/wiki/Trygve_Reenskaug)).

This statement is contrary to the vision of Facebook.

I wondered how the creator himself described that architectural style. Here are some interesting schemes from that epoch:

![Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html](/garden/flux-some-things-never-change/trygve-scheme-1.webp)

_Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html_

![Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html](/garden/flux-some-things-never-change/trygve-scheme-2.webp)

_Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html_

![Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html](/garden/flux-some-things-never-change/trygve-scheme-3.webp)

_Source: http://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html_

Interesting pictures, aren’t they? The first thing that I like in them is the appearance of a new user. It seems to me that this is important for any scheme, which describes the architecture of client software.

The second interesting moment is that it is a connecting place for the controller and view in the early schemes. Trygve defines it as the Editor and later as the Tool.

He defined four terms in his first note on his concept: Model, View, Controller and Editor. The Editor is an ephemeral component, which the View creates on request as an interface between the view and input devices, like the mouse and keyboard.

After the professor had left the Xerox PARC, Jim Althoff and others developed and implemented the first version of MVC for the library of the Smalltalk-80 types. The professor was not involved in the development.

According to Trygve, Jim Althoff treated the term “Controller” in a slightly different way.

The essential aspect of the original MVC was that the Controller was responsible for the creation and coordination of its subordinate views.

In the later notes, the view takes and processes user input related to itself. The controller takes and processes entry data related to unit Controller/View in general, which is now called the Tool.

Martin Fowler calls this tandem Presentation Layer.

Trygve emphasizes in [his paper](http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf) that the basic actors of any client system are final user (Mental Model) and subject domain data (Domain Model/Data). The main aim of MVC is overcoming the gap between the user mental model and the digital model existing in the computer.

This concept is still relevant, despite the fact that it was the [SmallTalk](https://en.wikipedia.org/wiki/Smalltalk) epoch and there was no concept of web-applications. The essence of every program is the user and data interconnection. They communicate with each other by means of a layer which is situated between them.

Input and output threads are always the basis of the interconnection of a program and a human. A generalized scheme may look like this:

![Input and output threads](/garden/flux-some-things-never-change/input-output.webp)

I, therefore, interpret the controller as a data input point, and the view as a data output point. Moreover, the input point is a complex of peripheral devices view control elements. At the same time, the view and the controller are slightly connected. However, they do not communicate directly. The view delegates to the controller the obligation to send a message about the user’s action.

The input thread can change the condition of the subject model. The model informs the user about its changes, using the data output point.

The connection of the controller and the view is presented as one-to-many in one of Trygve’s schemes. Why? I think it was because at that time, any button or arrow at the user interface was the view. Has anything changed since? I don’t think so.

![Controller and view connection](/garden/flux-some-things-never-change/controller-view.webp)

The view is often interpreted as the whole page in the “kraken” interpretation. Actually, it is always a component tree. Each component can perform as easily as the view.

![Component tree as views](/garden/flux-some-things-never-change/component-tree.webp)

The connection of an interconnection layer with a user and a model is of the many-to-many type. It is also relevant for modern programs — one page may display data and features of various subject models. A model, in turn, may be represented by a data structure:

![Many-to-many interconnection](/garden/flux-some-things-never-change/many-to-many-1.webp)

![Many-to-many data structure](/garden/flux-some-things-never-change/many-to-many-2.webp)

Let us try to formulate a generic description of MVC:

- The Model (Model) presents the data and responses to the commands of the controller, changing its state
- The View is responsible for the display of model data to a user, reacting to the model changes
- The Controller interprets user actions, informing the model about the necessity of changes

We get Undirectional DataFlow:

![Unidirectional DataFlow](/garden/flux-some-things-never-change/unidirectional.webp)

Is it not the same as Facebook and Co suggest?

- Store — data store
- Dispatcher — addresses the user’s action to the store
- View — a tree of React-components
- Action — user’s action, plain object
- Action Creator — initiates the action (object)
- Reducer — change the state of the data store

![Wikipedia MVC](/garden/flux-some-things-never-change/wikipedia-mvc.webp)

_Source: https://en.wikipedia.org/wiki/Model–view–controller_

The revolution did not take place at the end. Nothing changed. Everything is performed by means of MVC as it was earlier. I observe only another interpretation of this concept and the substitution of definitions.

What problems were discussed by the Facebook representatives?

It is worth starting with the fact that over time the explanation of the concept about sharing responsibilities of the system has come to the realization of concrete patterns.

![Patterns layered on MVC](/garden/flux-some-things-never-change/patterns.webp)

Look at the Apple schemes. They are describing system layers by means of concrete patterns: Observer, Strategy, and Composite. This mistake is continuing from the appearance of “[Gang of four](https://en.wikipedia.org/wiki/Design_Patterns)”.

The evolution of console software into server software influenced the primary definition.

Abstractions have turned into something concrete:

![MVC Model 2](/garden/flux-some-things-never-change/mvc-model-2.webp)

_MVC Model 2_

The problems were announced long ago. They will be same for Flux/Redux as well as for any other concept and framework. At first you have a clear thought and you start from something really simple. However, over time your clear code turns into an ugly monster (kraken?). The project starts to get stuck in this software tar pit.

![Source: https://www.youtube.com/watch?v=hALFGQNeEnU](/garden/flux-some-things-never-change/tar-pit.webp)

_Source: https://www.youtube.com/watch?v=hALFGQNeEnU_

Will Redux and Flux help me to develop the architecture of my project more clearly? Will they keep my thoughts clear? Are there the instruments which will prevent me from getting into a mess with all of these arrows?

Being instruments and subsequent interpretations they are empowered to live. However, during this project I slowly started to cut Redux out. We shall see how things turn out. Will I manage to keep my thoughts clear or will everything turn into a swamp again?

### Conclusions

The entire concept will based on the following, until essential changes take place in the field of [Human-сomputer interaction](https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction):

![Conclusions diagram](/garden/flux-some-things-never-change/conclusions.webp)

![Human-computer interaction](/garden/flux-some-things-never-change/hci.webp)

Everyone will pass this opinion. The problem of these hundreds of arrows will continue with this concept. Just as someone can write clear code, but someone can get stuck into his swamp.

The aspects of this concept disappear within the source code of this swamp. I know it from experience, since many of my projects fell into mire.

Probably, you would like to ask a question: “OK, cool Bro, what then?” Nothing, just treat this text as my own Brain Dump.

I am now glad that I have been plunged into these terms and this “rethinking” of the development of the web-application client layer. At least I have started to interpret MVC in a fresh new way. I started to explain these terms more abstractly.

I am also glad that I have become mature enough to publish my thoughts. Maybe, my opinion will change in the future and it will be interesting to come back to this text and laugh.

P. S. Everything that is written above is my modest subjective opinion and my interpretation.

---
title: Пирамида тестирования
description: Три тезиса пирамиды Майка Кона — скорость, стоимость и пропорции модульных, системных и GUI-тестов.
date: 2017-08-17
tags: [testing, programming, mental-model, seedling]
---

![Пирамида тестирования](/garden/testing-pyramid/pyramid.webp)

1. Модульные тесты реализовывать быстрее, чем GUI тесты (время на разработку меньше). Модульные тесты отрабатывают быстрее, чем GUI.

2. Модульные тесты дешевле, чем GUI тесты (однако, стремясь к вершине пирамиды, мы получаем большую уверенность в том, что все работает как ожидалось).

3. Тестирование должно быть разносторонним, но соотношение тестов должно быть таково, что модульных количественно больше, чем GUI. Системные тесты занимают золотую середину.

Впервые концепция описана в [Succeeding with Agile: Software Development Using Scrum](https://www.amazon.com/Succeeding-Agile-Software-Development-Using/dp/0321579364) Mike Cohn, 2009.

Дополнительные интересные ссылки по теме (в том числе об анти-шаблоне «рожок мороженого»):

- [The Forgotten Layer of the Test Automation Pyramid](https://www.mountaingoatsoftware.com/blog/the-forgotten-layer-of-the-test-automation-pyramid)
- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Agile Nutshell: The Testing Pyramid](http://www.agilenutshell.com/episodes/41-testing-pyramid)
- [Google Testing: Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [The Evolution of the Testing Pyramid](https://james-willett.com/2016/09/the-evolution-of-the-testing-pyramid/)
- [Testing Tips & Tricks — WWDC 2018](https://developer.apple.com/videos/play/wwdc2018/417)

---

### Связанные заметки

- [[Стратегия автоматического тестирования на JavaScript [Видео]](/garden/legacy-testing-strategy)]
- [[Тесты, которые должен писать разработчик](/garden/tests-developer-should-write)]

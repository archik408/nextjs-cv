---
title: The Testing Pyramid
description: Mike Cohn’s three points on the testing pyramid — speed, cost, and the right mix of unit, service and GUI tests.
date: 2017-08-17
tags: [testing, programming, mental-model, seedling]
---

![The Testing Pyramid](/garden/testing-pyramid/pyramid.webp)

1. Unit tests are faster to write than GUI tests (less development time). Unit tests also run faster than GUI tests.

2. Unit tests are cheaper than GUI tests (though climbing toward the top of the pyramid gives more confidence that everything works as expected).

3. Testing should be multi-layered, but the proportions matter: there should be more unit tests than GUI tests by count. Service / system tests sit in the sweet middle.

The concept was first described in [Succeeding with Agile: Software Development Using Scrum](https://www.amazon.com/Succeeding-Agile-Software-Development-Using/dp/0321579364) by Mike Cohn, 2009.

Further reading on the topic (including the “ice cream cone” anti-pattern):

- [The Forgotten Layer of the Test Automation Pyramid](https://www.mountaingoatsoftware.com/blog/the-forgotten-layer-of-the-test-automation-pyramid)
- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Agile Nutshell: The Testing Pyramid](http://www.agilenutshell.com/episodes/41-testing-pyramid)
- [Google Testing: Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [The Evolution of the Testing Pyramid](https://james-willett.com/2016/09/the-evolution-of-the-testing-pyramid/)
- [Testing Tips & Tricks — WWDC 2018](https://developer.apple.com/videos/play/wwdc2018/417)

---

### Related notes

- [JavaScript test automation strategy for a legacy system (video, RU)](/garden/legacy-testing-strategy)
- [A Visual Tutorial on Every Type of Test You Can Write](/garden/tests-developer-should-write_en)

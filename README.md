# Project Lagertha

A UI/UX redesign of the popular Twitch-bot PhantomBot, by [phantombot.tv](https://phantombot.tv/)

**Why create this?** In order to implement PhantomBot with my streaming platform [the Ecosystem](http://bit.ly/MindfulG) I had a need to redesign PhantomBot's UI.

**Why open source?** As I started to work on the redesign I wondered if this could be useful for someone else. I knew PhantomBot were in need of a UI/UX change, and until the official version they are working on comes along I hope someone finds this useful.

If you are interested in what else I have developed, or in the streaming platform I am working on, please don't hesistate to visit [my homepage](http://bit.ly/MindfulG)

## Status

* You can find the status of the project over on [Trello](https://trello.com/b/5kni5emL/mindful-design-public)

[![Build Status](https://travis-ci.org/Mindful-Design/Lagertha.svg?branch=master)](https://travis-ci.org/Mindful-Design/Lagertha)

## Getting Started

To use this on your own setup, download the repo and replace your web folders with these. Be mindful (pun intended) of the PhantomBot version requirements.

To make use of some features, you need to create a file called **mdkeys.js** and place it in the /web/panel/js folder. In this file you input:

Your Twitch api url
Your [Twitch client ID](https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843)

Sample-file:

```
var clientID = 'xawdadawd2r52a522ad2ad24a24a2';
var urlTwitch = "https://api.twitch.tv/kraken/channels/mindfuldesign";

```

### Prerequisites

At the moment the redesign runs on **PhantomBot 2.3.5.3**, and as such it needs this version in order to work. I am working on making a version that will follow along with the PhantomBot main branch better.

## Screenshots

[![](https://community.phantombot.tv/assets/uploads/files/1490803269772-upload-9f92a4a1-86dd-422d-b939-2b579a5c50dc-resized.png)](https://ryxnfw-dm2305.files.1drv.com/y4mZffoUOdmkFi-8yXR-JWct7jSqFmHR0G3NX7bxm93y5wq3LZCoCL56i-eaPxgtEZ9I2uzZx515gpYORPFoR8COYS_PIFLRRSh9X-IwrTSd-ilVM-skKqHG9ayYQKWxVuRguyWaOTm5r8BxH8mjJFuWvSUeOZfUgUjwjBW8RheLZ9qqu2O1X7tckGeG6V8V4IMRvVZc6H8k_og9EkMhwY00Q?width=1919&height=1023&cropmode=none)
[![](https://community.phantombot.tv/assets/uploads/files/1490803423426-upload-99fbf404-93bd-4ab3-be66-399203ce1a1f-resized.png)](https://community.phantombot.tv/assets/uploads/files/1490803269772-upload-9f92a4a1-86dd-422d-b939-2b579a5c50dc.png)


## Built With

* [Brackets](http://brackets.io/) - HTML/CSS coding
* [Visual Studio Code](https://code.visualstudio.com/) - JS coding

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Mindful-Design/Lagertha/tags). 

## How can I follow along/contribute?

* The feature roadmap of Lagertha (Which builds upon this repo) is hosted on [Trello](https://trello.com/b/5kni5emL/mindful-design-public).
* If you are a developer, feel free to check out the source and submit pull requests.
* Please don't forget to **watch**, and **star this repo**!
* A huge thanks goes out to the PhantomBot developers and Creative Tim for which this software is built upon.

## Authors

* **Mindful** - *Initial work* - [Mindful Design](https://github.com/Mindful-Design)

## License

Copyright (C) 2017 Mindful Design

## Acknowledgments

* Light Bootstrap Dashboard
* PhantomBot developers
* Dad

# micro:bit Learning Platform

A team-designed interactive learning platform for introductory physical computing and programming in a sixth-grade classroom. Developed as a CI 489 project at the University of Illinois Urbana-Champaign in Spring 2026.

## Prototype preview

Existing project screenshot supplied with the original export:

![Block coding lesson](src/imports/image-2.png)

## Learning experience

- Guided lessons covering inputs/outputs, algorithms, variables, conditionals, loops, sensors, radio communication, and a final project.
- Block-based coding workspace and an on-screen micro:bit simulator.
- Reflection prompts, self-checks, and collaborative activities.
- Browser-local progress and reflection storage.

The supplied source is a React/TypeScript frontend exported from Figma Make. The simulator represents program behavior on screen; this repository does not establish physical-device connectivity or an AI tutoring backend. Curriculum scope does not imply every hardware feature is fully simulated.

## Team and my role

- Adhwita Gopi Selvan — Documentation and Synthesis Lead
- Daniel Chen — Project Coordinator
- Matthew Port Louis — Technical Lead
- Xiaoxi (Brooke) Chen — Design Lead

As Design Lead, I contributed to the platform's learning experience and interface design within the team's classroom-informed design process. The source bundle is a team artifact generated through Figma Make; it is not represented as independently hand-written code by a single team member.

## Classroom evaluation

The team reports a field test with 20 sixth-grade students working in pairs during an approximately 40-minute session. Feedback informed priorities around block editing, navigation, wording, and challenge differentiation. These observations support usability iteration; they do not establish a measured improvement in learning outcomes. See [evaluation summary](docs/evaluation-summary.md).

## Run locally

Install Node.js 20.19+ or a compatible newer release, then run:

```sh
npm install
npm run dev
```

For a production build:

```sh
npm run build
```

The application uses React, TypeScript, Vite, Tailwind CSS, and UI components listed in package.json. Progress is stored in the current browser, not in a shared classroom account.

## Documentation and attribution

- [Project overview](docs/project-overview.md)
- [Evaluation summary](docs/evaluation-summary.md)
- [Original export README](docs/original-bundle-readme.md)
- [Third-party attributions](ATTRIBUTIONS.md)

This portfolio copy excludes raw observation logs, participant-level notes, live survey links, and internal planning files. Original source files are preserved; package metadata and React dependencies were clarified for standalone installation.

## Verification

Dependency installation and a Vite production build passed during preparation. Classroom interactions and physical hardware were not retested.

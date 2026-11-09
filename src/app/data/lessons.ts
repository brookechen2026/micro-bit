/**
 * BBC micro:bit Learning Platform - Lesson Data
 * 
 * This file contains all lesson content, activities, and block definitions
 * for the interactive micro:bit coding platform.
 * 
 * Curriculum based on 7-week Physical Computing with micro:bit course
 */

export interface Lesson {
  id: string;
  week: number;
  title: string;
  description: string;
  pages: LessonPage[];
  referenceUrl?: string;
}

export interface LessonPage {
  id: string;
  title: "string";
  content: string;
  concept: string;
  hints?: string[];
  starterCode?: CodeBlock[];
  guided?: boolean;
  steps?: {
    instruction: string;
    allowedBlocks: string[];
    requiredBlocks: string[];
    validationMessage?: string;
  }[];
}

export interface CodeBlock {
  id: string;
  type: string;
  text: string;
  icon: string;
  color: string;
  params?: { name: string; type: string; default?: any }[];
}

export interface Activity {
  id: string;
  week: number;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  objective: string;
  hints: string[];
  solution?: CodeBlock[];
  requiredBlocks: string[];
}

export const blockTypes: CodeBlock[] = [
  {
    id: "on-start",
    type: "event",
    text: "on start",
    icon: "Play",
    color: "bg-green-500",
  },
  {
    id: "on-button-a",
    type: "event",
    text: "on button A pressed",
    icon: "SquareMousePointer",
    color: "bg-green-500",
  },
  {
    id: "on-button-b",
    type: "event",
    text: "on button B pressed",
    icon: "SquareMousePointer",
    color: "bg-green-500",
  },
  {
    id: "show-string",
    type: "basic",
    text: "show string",
    icon: "Type",
    color: "bg-blue-500",
    params: [{ name: "text", type: "string", default: "Hello!" }],
  },
  {
    id: "show-number",
    type: "basic",
    text: "show number",
    icon: "Hash",
    color: "bg-blue-500",
    params: [{ name: "value", type: "number", default: 0 }],
  },
  {
    id: "show-icon",
    type: "basic",
    text: "show icon",
    icon: "Smile",
    color: "bg-blue-500",
    params: [{ name: "icon", type: "icon", default: "Heart" }],
  },
  {
    id: "show-leds",
    type: "basic",
    text: "show leds",
    icon: "Grid3x3",
    color: "bg-blue-500",
    params: [{ name: "pattern", type: "led-matrix", default: [] }],
  },
  {
    id: "clear-screen",
    type: "basic",
    text: "clear screen",
    icon: "Eraser",
    color: "bg-blue-500",
  },
  {
    id: "pause",
    type: "basic",
    text: "pause (ms)",
    icon: "Clock",
    color: "bg-blue-500",
    params: [{ name: "ms", type: "number", default: 100 }],
  },
  {
    id: "forever",
    type: "loop",
    text: "forever",
    icon: "Repeat",
    color: "bg-purple-500",
  },
  {
    id: "repeat",
    type: "loop",
    text: "repeat",
    icon: "RotateCw",
    color: "bg-purple-500",
    params: [{ name: "times", type: "number", default: 4 }],
  },
  {
    id: "while",
    type: "loop",
    text: "while",
    icon: "RefreshCw",
    color: "bg-purple-500",
    params: [{ name: "condition", type: "boolean", default: true }],
  },
  {
    id: "for",
    type: "loop",
    text: "for",
    icon: "ListOrdered",
    color: "bg-purple-500",
    params: [
      { name: "index", type: "string", default: "i" },
      { name: "to", type: "number", default: 4 },
    ],
  },
  {
    id: "if",
    type: "logic",
    text: "if",
    icon: "GitBranch",
    color: "bg-yellow-500",
    params: [{ name: "condition", type: "boolean", default: true }],
  },
  {
    id: "if-else",
    type: "logic",
    text: "if...else",
    icon: "GitMerge",
    color: "bg-yellow-500",
    params: [{ name: "condition", type: "boolean", default: true }],
  },
  {
    id: "set-variable",
    type: "variable",
    text: "set",
    icon: "Variable",
    color: "bg-orange-500",
    params: [
      { name: "variable", type: "string", default: "count" },
      { name: "value", type: "number", default: 0 },
    ],
  },
  {
    id: "change-variable",
    type: "variable",
    text: "change",
    icon: "TrendingUp",
    color: "bg-orange-500",
    params: [
      { name: "variable", type: "string", default: "count" },
      { name: "by", type: "number", default: 1 },
    ],
  },
  {
    id: "show-variable",
    type: "variable",
    text: "show variable",
    icon: "Eye",
    color: "bg-orange-500",
    params: [{ name: "variable", type: "string", default: "total" }],
  },
  {
    id: "radio-send",
    type: "radio",
    text: "radio send number",
    icon: "Radio",
    color: "bg-teal-500",
    params: [{ name: "value", type: "number", default: 0 }],
  },
  {
    id: "radio-send-string",
    type: "radio",
    text: "radio send string",
    icon: "Radio",
    color: "bg-teal-500",
    params: [{ name: "text", type: "string", default: "Hi" }],
  },
  {
    id: "on-radio-received",
    type: "event",
    text: "on radio received",
    icon: "Antenna",
    color: "bg-green-500",
  },
  {
    id: "random",
    type: "math",
    text: "pick random",
    icon: "Dices",
    color: "bg-pink-500",
    params: [
      { name: "min", type: "number", default: 0 },
      { name: "max", type: "number", default: 10 },
    ],
  },
];

export const lessons: Lesson[] = [
  {
    id: "week1-intro-to-microbit",
    week: 1,
    title: "Week 1: What is the micro:bit?",
    description: "Introduction to micro:bit hardware, MakeCode, and using the display and buttons",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/making",
    pages: [
      {
        id: "page-1",
        title: "Welcome to micro:bit!",
        concept: "Introduction",
        content: `**What is the micro:bit?**

The micro:bit is a tiny computer you can program to do amazing things! It has buttons, lights, and sensors.

**What will you learn?**

You'll create programs by dragging and connecting code blocks. Make the micro:bit light up, show pictures, and respond to buttons.

**Ready to start?**

Click the "Start Lesson" button below to begin your first program!`,
      },
      {
        id: "page-2",
        title: "Your First Program",
        concept: "Output",
        guided: true,
        steps: [
          {
            instruction: "Drag the green 'on start' block into the workspace",
            allowedBlocks: ["on-start"],
            requiredBlocks: ["on-start"],
            validationMessage: "Great! The 'on start' block runs when your program begins.",
          },
          {
            instruction: "Find the blue 'show icon' block and drag it inside the 'on start' block",
            allowedBlocks: ["on-start", "show-icon"],
            requiredBlocks: ["on-start", "show-icon"],
            validationMessage: "Perfect! Now the micro:bit will show an icon when it starts.",
          },
          {
            instruction: "Click 'Run Code' to see your program work!",
            allowedBlocks: ["on-start", "show-icon"],
            requiredBlocks: ["on-start", "show-icon"],
            validationMessage: "Awesome! You created your first program!",
          },
        ],
        content: `You'll create your first program step by step.`,
        hints: [
          "Start with an 'on start' event block",
          "Find the 'show icon' block in the Basic category (blue blocks)",
          "Click on the icon parameter to choose the heart",
          "Press 'Run Code' to see it on the simulator",
        ],
      },
      {
        id: "page-3",
        title: "Input → Output",
        concept: "Cause and Effect",
        guided: true,
        steps: [
          {
            instruction: "Drag 'on button A pressed' into the workspace",
            allowedBlocks: ["on-button-a"],
            requiredBlocks: ["on-button-a"],
            validationMessage: "Good! This listens for button A presses.",
          },
          {
            instruction: "Add 'show icon' inside the button A block, choose a smile",
            allowedBlocks: ["on-button-a", "show-icon"],
            requiredBlocks: ["on-button-a", "show-icon"],
            validationMessage: "Nice! Button A will show a smile.",
          },
          {
            instruction: "Drag 'on button B pressed' into the workspace",
            allowedBlocks: ["on-button-a", "show-icon", "on-button-b"],
            requiredBlocks: ["on-button-a", "show-icon", "on-button-b"],
            validationMessage: "Great! Now add an icon for button B.",
          },
          {
            instruction: "Add 'show icon' inside button B, choose a different icon",
            allowedBlocks: ["on-button-a", "show-icon", "on-button-b"],
            requiredBlocks: ["on-button-a", "show-icon", "show-icon", "on-button-b"],
            validationMessage: "Perfect! Click 'Run Code' then test your buttons!",
          },
        ],
        content: `Learn how buttons (input) control what the micro:bit shows (output).`,
        hints: [
          "Each button needs its own event block",
          "The 'show icon' block goes inside the event block",
          "Try different icons for each button",
          "Test by clicking the A and B buttons on the simulator",
        ],
      },
      {
        id: "page-4",
        title: "Challenge Level",
        concept: "Creative Challenge",
        content: `**Mission:** Build a mood display that responds to both buttons!

**Goals:**
- [ ] Button A shows a happy icon
- [ ] Button B shows a sad icon
- [ ] Test both buttons work

**Bonus:** Make it show a star when you run the code!`,
        hints: [
          "Use 'on start' to show a star when the program begins",
          "Use 'on button A pressed' with a smile icon",
          "Use 'on button B pressed' with a frown icon",
          "Remember to click 'Run Code' before testing buttons",
        ],
      },
      {
        id: "page-5",
        title: "Peer Activity: Code Swap!",
        concept: "Collaboration",
        content: `**Partner Up!**

Work with a classmate and take turns being the "Programmer" and the "Tester."

**Activity Steps:**

1. Programmer: Create a program with at least 2 different button events (A and B)
2. Tester: Watch the programmer run the code and test BOTH buttons
3. Share: Explain to your partner what each button does
4. Switch: Now swap roles and repeat!

**Discussion Questions:**

• What was similar about your programs?
• What was different?
• Did the program do what you expected?

**Challenge:** Can you both create programs that show the SAME icons, but use different buttons?`,
      },
      {
        id: "page-6",
        title: "Lesson Complete!",
        concept: "Review",
        content: `**Review Cards:**

**What is the micro:bit?**
A tiny computer with buttons, lights, and sensors that you can program!

**What is code?**
Instructions you give to the micro:bit to tell it what to do.

**What is Input → Output?**
When you press a button (input), the micro:bit shows something (output).

**Question 1:**

Which of these is an INPUT to the micro:bit?

A) Showing a heart on the LED display
B) Pressing button A
C) The micro:bit lighting up

**Question 2:**

Which block makes the micro:bit show pictures?

A) on start
B) show icon
C) on button pressed`,
      },
    ],
  },
  {
    id: "week2-algorithms",
    week: 2,
    title: "Week 2: Algorithms",
    description: "Understanding input, processing, and output with micro:bit",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/algorithms",
    pages: [
      {
        id: "page-1",
        title: "What is an Algorithm?",
        concept: "Introduction",
        content: `**What is an Algorithm?**

An algorithm is a step-by-step set of instructions to solve a problem. Every program you write is an algorithm!

**How Computers Work**

Computers follow a simple pattern: Input → Process → Output. The micro:bit takes input from buttons, processes it with your code, and shows output on the LEDs.

**Ready to build algorithms?**

Click "Start Lesson" to create your first input-output algorithm!`,
      },
      {
        id: "page-2",
        title: "Building Your First Algorithm",
        concept: "Input → Output",
        guided: true,
        steps: [
          {
            instruction: "Drag 'on button A pressed' into the workspace",
            allowedBlocks: ["on-button-a", "show-number"],
            requiredBlocks: ["on-button-a"],
            validationMessage: "Good! Button A is your INPUT.",
          },
          {
            instruction: "Find the blue 'show number' block and drag it inside button A",
            allowedBlocks: ["on-button-a", "show-number"],
            requiredBlocks: ["on-button-a", "show-number"],
            validationMessage: "Perfect! Now change the number to your favorite number.",
          },
          {
            instruction: "Click 'Run Code' then press button A on the simulator to test!",
            allowedBlocks: ["on-button-a", "show-number"],
            requiredBlocks: ["on-button-a", "show-number"],
            validationMessage: "Awesome! You created an input-output algorithm!",
          },
        ],
        content: `Build a simple algorithm that responds to button presses.`,
        hints: [
          "Button A is the input (what you do)",
          "The number displayed is the output (what the micro:bit does)",
          "Your code is the processing step in between",
        ],
      },
      {
        id: "page-3",
        title: "Multiple Inputs & Outputs",
        concept: "Algorithm Patterns",
        guided: true,
        steps: [
          {
            instruction: "Your button A code is saved! Now add 'on button B pressed' block",
            allowedBlocks: ["on-button-a", "show-number", "on-button-b", "show-string", "on-start", "show-icon"],
            requiredBlocks: ["on-button-a", "show-number", "on-button-b"],
            validationMessage: "Great! Now button B is another input.",
          },
          {
            instruction: "Add 'show string' block inside button B, type a message like 'Hello!'",
            allowedBlocks: ["on-button-a", "show-number", "on-button-b", "show-string", "on-start", "show-icon"],
            requiredBlocks: ["on-button-a", "show-number", "on-button-b", "show-string"],
            validationMessage: "Excellent! Now you have different outputs for different inputs.",
          },
          {
            instruction: "Add 'on start' and 'show icon' blocks to show an icon when the program starts",
            allowedBlocks: ["on-start", "on-button-a", "show-number", "on-button-b", "show-string", "show-icon"],
            requiredBlocks: ["on-start", "on-button-a", "show-number", "on-button-b", "show-string", "show-icon"],
            validationMessage: "Perfect! Click Run Code and test all your inputs!",
          },
        ],
        content: `Learn how different inputs can trigger different outputs.`,
        hints: [
          "Each event block is a different input source",
          "Each input can have its own unique output",
          "The 'on start' event runs automatically when the program begins",
        ],
      },
      {
        id: "page-4",
        title: "Algorithm Challenge",
        concept: "Creative Challenge",
        content: `**Mission:** Create a number picker algorithm with 3 different outputs!

**Goals:**
- [ ] On start: show a star icon
- [ ] Button A: show the number 7
- [ ] Button B: show a smiley face icon
- [ ] Test all three events work correctly

**Bonus:** Add a 'show string' block to display your name when button A is pressed (after the number)!`,
        hints: [
          "Use 'on start' with 'show icon' for the star",
          "Use 'on button A pressed' with 'show number' set to 7",
          "Use 'on button B pressed' with 'show icon' for a smile",
          "Remember: each event block runs independently when triggered!",
        ],
      },
      {
        id: "page-5",
        title: "Peer Activity: Algorithm Detective!",
        concept: "Collaboration",
        content: `**Partner Challenge!**

Work with a partner to be "Algorithm Detectives" and figure out each other's code!

**How to Play:**

1. Programmer: Build a program with 3 event blocks (on start, button A, button B)
2. Detective: DON'T look at the code! Just run it and press the buttons
3. Guess: Try to describe what each button does
4. Reveal: The programmer shows their code - were you right?
5. Switch: Trade roles and repeat!

**Extra Challenge:**

Can you create a "secret code" program? Use numbers to send messages!
• Button A = 1
• Button B = 2
• On start = 0

Your partner has to remember the sequence of numbers you show them!

**Discussion:** How did breaking down the algorithm help you understand it?`,
      },
      {
        id: "page-6",
        title: "Lesson Complete!",
        concept: "Review",
        content: `**Review Cards:**

**What is an Algorithm?**
A step-by-step set of instructions that tells the computer what to do.

**What is Input → Process → Output?**
The pattern all programs follow: take input, process it with code, produce output.

**What are the micro:bit's inputs?**
Buttons A and B, pins, sensors (temperature, accelerometer, compass).

**Question 1:**

What does the "process" step do in Input → Process → Output?

A) Takes information from buttons or sensors
B) Follows your code instructions to decide what to do
C) Shows the result on the LED display

**Question 2:**

Which block type represents INPUT?

A) on button pressed
B) show icon
C) show number`,
      },
    ],
  },
  {
    id: "week3-variables",
    week: 3,
    title: "Week 3: Variables",
    description: "Learn to store and manipulate data using variables",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/variables",
    pages: [
      {
        id: "page-1",
        title: "What are Variables?",
        concept: "Data Storage",
        content: `Variables are like labeled containers that store information in your program.

**Why Use Variables?**
- Keep track of a score in a game
- Count how many times something happens
- Store sensor readings
- Remember the state of your program

**Important Concepts:**
- A variable holds **one value** at a time
- When you change a variable, the **new value replaces** the old one
- Variable names should be **meaningful** (e.g., "score" not "x")

**Common Variable Names:**
score, count, level, speed, temperature, lives, points

Variables are essential for creating dynamic, interactive programs!`,
        hints: [
          "Think of a variable like a box with a label on it",
          "You can put things in the box and take them out",
          "The label helps you remember what's inside",
        ],
      },
      {
        id: "page-2",
        title: "Creating and Using Variables",
        concept: "Variable Operations",
        content: `There are three main things you do with variables:

**1. Set (Create/Initialize)**
Give the variable a starting value:
- **set count to 0**

**2. Change (Modify)**
Increase or decrease the value:
- **change count by 1** (adds 1)
- **change count by -1** (subtracts 1)

**3. Use (Read)**
Use the variable's value in other blocks:
- **show number count**

**Example Pattern:**
On start: set score to 0
On button A: change score by 1, then show score

This pattern lets you count button presses!`,
        hints: [
          "Always set a variable to an initial value when your program starts",
          "Use 'change by' to add or subtract from the current value",
          "Display the variable to see its current value",
        ],
        starterCode: [
          {
            id: "on-start",
            type: "event",
            text: "on start",
            icon: "Play",
            color: "bg-green-500",
          },
        ],
      },
      {
        id: "page-3",
        title: "Math with Variables",
        concept: "Arithmetic Operations",
        content: `You can perform mathematical operations with variables:

**Basic Math Blocks:**
- **Addition**: count + 1
- **Subtraction**: count - 1
- **Multiplication**: count × 2
- **Division**: count ÷ 2

**Example Use Cases:**
- Doubling a score: set score to score × 2
- Calculating average temperature
- Converting between units
- Creating formulas for games

**Practice Challenge:**
Create a program that:
1. Starts with a variable set to 10
2. When button A is pressed, multiply it by 2
3. Display the result

This combines variables, buttons, and math!`,
        hints: [
          "Use 'set' to create the variable with value 10",
          "In button A event, set the variable to variable × 2",
          "Use 'show number' to display the result",
        ],
      },
    ],
  },
  {
    id: "week4-conditionals",
    week: 4,
    title: "Week 4: Conditionals",
    description: "Making decisions in your programs with if-then logic",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/conditionals",
    pages: [
      {
        id: "page-1",
        title: "What are Conditionals?",
        concept: "Decision Making",
        content: `Conditionals let your program make decisions based on conditions. They answer the question: "IF this is true, THEN do that."

**Why Use Conditionals?**
- Check if a score is above a certain number
- Test if a button was pressed
- See if temperature is too hot or cold
- Determine if a player wins or loses

**Real-Life Example:**
IF it's raining THEN bring an umbrella

**In Programming:**
IF temperature > 25 THEN show "Hot"

Conditionals make your programs smart and responsive!`,
      },
      {
        id: "page-2",
        title: "If...Then Blocks",
        concept: "Simple Conditionals",
        content: `The basic conditional block is **if...then**.

**How It Works:**
IF (condition is true)
THEN (do these actions)

**Example:**
IF button A is pressed
THEN show a heart

**Conditions You Can Check:**
- Is a variable greater than, less than, or equal to a number?
- Is a button pressed?
- Is the temperature above/below a value?

**Try This:**
Create a counter program. If the count reaches 10, show a celebration icon!`,
        hints: [
          "Create a counter with a variable",
          "After changing the variable, add an 'if' block",
          "Check if variable = 10",
          "Inside the if, show a star or trophy icon",
        ],
      },
      {
        id: "page-3",
        title: "If...Then...Else",
        concept: "Two-Way Decisions",
        content: `Sometimes you want to do one thing if a condition is true, and something different if it's false. That's where **if...then...else** comes in.

**How It Works:**
IF (condition is true)
THEN (do this)
ELSE (do that instead)

**Example: Hot or Cold?**
IF temperature > 20
THEN show "Warm"
ELSE show "Cold"

**Game Example:**
IF score > 50
THEN show "You Win!"
ELSE show "Try Again"

The ELSE part only runs when the condition is FALSE.

**Challenge:**
Create a simple game that uses if...then...else to determine win or lose!`,
        hints: [
          "Use a variable for score or points",
          "After the game action, check the score",
          "Show different messages for winning vs. losing",
        ],
      },
    ],
  },
  {
    id: "week5-iteration",
    week: 5,
    title: "Week 5: Iteration & Loops",
    description: "Repeating actions efficiently with different types of loops",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/iteration",
    pages: [
      {
        id: "page-1",
        title: "What is Iteration?",
        concept: "Repetition",
        content: `Iteration means repeating an action multiple times. In programming, we use loops to iterate.

**Why Use Loops?**
- Repeat an animation continuously
- Count from 1 to 10 without writing 10 separate blocks
- Keep a game running until someone wins
- Process a list of items

**The Power of Loops:**
Instead of copying the same blocks over and over, you write them once and put them in a loop. This makes your code:
- Shorter and cleaner
- Easier to modify
- More efficient

Loops are one of the most important concepts in programming!`,
      },
      {
        id: "page-2",
        title: "Types of Loops",
        concept: "Loop Variations",
        content: `MakeCode offers several types of loops for different situations:

**1. Repeat Loop**
Runs a specific number of times
Example: "repeat 4 times"
Use when: You know exactly how many times to loop

**2. While Loop**
Keeps running as long as a condition is true
Example: "while temperature < 30"
Use when: You don't know how many times, but you know when to stop

**3. For Loop**
Counts through a range of numbers
Example: "for i from 0 to 4"
Use when: You need to count or track iterations

**4. Forever Loop**
Runs continuously until the micro:bit is reset
Example: Animations, games, constant monitoring
Use when: You want something to repeat indefinitely`,
      },
      {
        id: "page-3",
        title: "Loops in Action",
        concept: "Practical Applications",
        content: `Let's see how different loops solve different problems:

**Countdown Timer (For Loop):**
- For i from 10 to 0
- Show number i
- This counts down from 10 to 0

**Beating Heart (Forever Loop):**
- Forever
- Show large heart, pause, show small heart, pause
- This creates a continuous animation

**Game Level (While Loop):**
- While score < 100
- Play game, increase score
- Stops when score reaches 100

**Practice Challenge:**
Create an animation that repeats 5 times, showing different icons with pauses between them.`,
        hints: [
          "Use a 'repeat 5 times' loop",
          "Inside, add multiple 'show icon' blocks",
          "Add 'pause' blocks between each icon",
          "Try 300ms pauses for smooth timing",
        ],
      },
    ],
  },
  {
    id: "week6-sensors",
    week: 6,
    title: "Week 6: Sensors",
    description: "Working with accelerometer, compass, and temperature sensors",
    referenceUrl: "https://makecode.microbit.org/projects/rock-paper-scissors",
    pages: [
      {
        id: "page-1",
        title: "The Accelerometer",
        concept: "Motion Detection",
        content: `The accelerometer detects movement and orientation of the micro:bit.

**What It Can Detect:**
- **Shaking**: When you shake the micro:bit
- **Tilting**: Which way the micro:bit is tilted
- **Gestures**: Specific movements like "face up", "face down", "logo up"
- **Pitch & Roll**: Exact angle measurements

**Common Uses:**
- Step counter (counts shakes)
- Spirit level (uses tilt)
- Dice roller (shake to randomize)
- Games controlled by tilting

**The Shake Event:**
'on shake' is a special event that triggers when the micro:bit detects shaking motion.

**Try This:**
Create a dice that shows a random number (1-6) when you shake it!`,
        hints: [
          "Use 'on shake' event",
          "Use 'pick random 1 to 6' block",
          "Show the random number on the display",
        ],
      },
      {
        id: "page-2",
        title: "Random Numbers",
        concept: "Randomization",
        content: `Random numbers are unpredictable values generated by the computer. They're essential for games and simulations!

**The Random Block:**
**pick random (min) to (max)**
- Generates a number between min and max (inclusive)
- Each time it runs, you might get a different number

**Common Uses:**
- Dice rolling: random 1 to 6
- Coin flip: random 0 to 1 (0=heads, 1=tails)
- Choosing random icons
- Game events with chance

**Rock-Paper-Scissors Example:**
- On shake: pick random 0 to 2
- If 0 show rock, if 1 show paper, if 2 show scissors

Combining random numbers with conditionals creates unpredictable, fun programs!`,
        hints: [
          "Store the random number in a variable",
          "Use if-then blocks to check the value",
          "Show different icons based on the number",
        ],
      },
      {
        id: "page-3",
        title: "Compass & Temperature",
        concept: "Environmental Sensors",
        content: `The micro:bit has sensors to detect direction and temperature!

**Compass (Magnetometer):**
- Detects magnetic north
- Returns a value from 0 to 359 (degrees)
- 0 = North, 90 = East, 180 = South, 270 = West
- Must be calibrated first (micro:bit shows instructions)

**Temperature Sensor:**
- Measures temperature in Celsius
- Built into the processor chip
- Reads ambient temperature (with slight offset from chip heat)

**Project Ideas:**
- **Digital Compass**: Show an arrow pointing north
- **Thermometer**: Display current temperature
- **Weather Station**: Combine temperature with other data

**Simple Thermometer:**
Forever loop → show number (temperature)`,
        hints: [
          "Use the 'temperature' block from Input category",
          "Display it with 'show number'",
          "Add a pause so it's readable",
        ],
      },
    ],
  },
  {
    id: "week7-radio",
    week: 7,
    title: "Week 7: Radio Communication",
    description: "Sending and receiving data between micro:bits wirelessly",
    referenceUrl: "https://makecode.microbit.org/courses/csintro/radio",
    pages: [
      {
        id: "page-1",
        title: "Introduction to Radio",
        concept: "Wireless Communication",
        content: `The micro:bit can communicate wirelessly with other micro:bits using radio signals!

**What is Radio?**
Radio lets micro:bits send and receive messages through the air, without wires. It's similar to walkie-talkies!

**Radio Features:**
- Range: Up to 70 meters in open space
- Groups: Set a radio group (0-255) to create private channels
- Types: Send numbers, strings, or custom values
- No internet needed: Works completely offline

**Real Applications:**
- Multi-player games
- Remote controls
- Sensor networks
- Message passing between friends

To use radio, both micro:bits must be on the same radio group!`,
      },
      {
        id: "page-2",
        title: "Sending Data",
        concept: "Broadcasting Messages",
        content: `To send data over radio, you need two things:

**1. Set Radio Group (Once at start):**
All micro:bits that want to communicate must be on the same group number (1-255)

**2. Send Data:**
- **radio send number**: Send a number
- **radio send string**: Send text
- **radio send value**: Send a named value (like "score" = 100)

**Example Program (Sender):**
On start: radio set group 1
On button A pressed: radio send string "Hello"

**What Can You Send?**
- Game scores
- Sensor readings (temperature, light level)
- Commands ("start", "stop", "reset")
- Player actions in a game`,
        hints: [
          "Always set the radio group first in 'on start'",
          "Choose the same group number for all communicating devices",
          "Test by sending a number when button A is pressed",
        ],
        starterCode: [
          {
            id: "on-start",
            type: "event",
            text: "on start",
            icon: "Play",
            color: "bg-green-500",
          },
        ],
      },
      {
        id: "page-3",
        title: "Receiving Data",
        concept: "Listening for Messages",
        content: `To receive radio messages, you use special radio event blocks:

**Radio Events:**
- **on radio received (receivedNumber)**: Runs when a number is received
- **on radio received (receivedString)**: Runs when text is received

**Example Program (Receiver):**
On start: radio set group 1
On radio received (receivedNumber): show number receivedNumber

**Two-Way Communication:**
Each micro:bit can both send AND receive! This enables:
- Chat programs
- Multi-player games
- Remote sensor monitoring
- Coordinated actions

**Project Ideas:**
- Hot/Cold game: One micro:bit sends temperature, others display it
- Marco Polo: Send messages back and forth
- Group voting system
- Synchronized light show`,
        hints: [
          "Receiver must use the same radio group as sender",
          "Use the received value (receivedNumber or receivedString)",
          "Display or process the received data",
          "Both micro:bits can send and receive simultaneously",
        ],
      },
    ],
  },
  {
    id: "final-project",
    week: 8,
    title: "Final Project",
    description: "Design and build your own micro:bit solution to a real-world problem",
    pages: [
      {
        id: "page-1",
        title: "Choose Your Project",
        concept: "Project Selection",
        content: `**Final Project: Design Challenge**

Choose ONE of these real-world challenges to solve with your team:

**Option 1: Safety Wearable Device**
After dark, increased outdoor safety is needed. Design and program a wearable device that provides safer conditions. The device must be:
• Wearable (can be attached to clothing or accessories)
• Activated by the wearer OR an environmental condition
• Helps make the wearer more visible or safe

**Option 2: Interactive Art Installation**
A community center wants an interactive art installation that entertains a variety of people. Design and program an interactive art display that:
• Includes lights and possibly movement
• Is accessible and engaging for all ages
• Responds to user interaction

**Option 3: Smart Dispenser Device**
People and pets need immediate access to items. Design and program a device that dispenses objects when an environmental interaction occurs. The device must:
• Have lights to indicate it has been activated
• Use a motor to dispense objects
• Respond to environmental triggers (buttons, sensors, etc.)

**Next Steps:**
Discuss with your team and choose which project you want to build!`,
      },
      {
        id: "page-2",
        title: "Planning: Your Design",
        concept: "Design Planning",
        content: `**Design Your Device**

Plan out your micro:bit project design:

**Questions to Answer:**

1. What problem does your device solve?

2. How will users interact with it?

3. What micro:bit features will you use?
   • Buttons?
   • LEDs?
   • Sensors (shake, temperature, light)?
   • Radio communication?
   • Motors or servos?

4. What will happen when the device is activated?

5. What materials do you need besides the micro:bit?

**Team Roles:**
Who will work on what part of the project?`,
      },
      {
        id: "page-3",
        title: "Build Your Project!",
        concept: "Implementation",
        content: `**Now Get Started Building!**

Use the coding workspace below to create your project program.

**Coding Tips:**
• Start simple - get one feature working first
• Test frequently - run your code after each addition
• Debug together - if something doesn't work, review as a team
• Add complexity gradually - don't try to do everything at once

**Remember:**
Your project should solve the problem you chose. Make sure it actually works for the intended purpose!`,
      },
    ],
  },
];

export const activities: Activity[] = [
  // Week 1 Activities
  {
    id: "hello-world",
    week: 1,
    title: "Hello World",
    description: "Display your first message on the micro:bit",
    difficulty: "beginner",
    objective: "Show the text 'Hello, World!' when the micro:bit starts",
    hints: [
      "You need an 'on start' event block",
      "Add a 'show string' block inside the event",
      "Type 'Hello, World!' in the text field",
    ],
    requiredBlocks: ["on-start", "show-string"],
  },
  {
    id: "happy-sad",
    week: 1,
    title: "Happy & Sad Faces",
    description: "Show different emotions using button controls",
    difficulty: "beginner",
    objective:
      "Display a happy face when button A is pressed and a sad face when button B is pressed",
    hints: [
      "Use two separate event blocks: 'on button A pressed' and 'on button B pressed'",
      "Use 'show icon' blocks with happy and sad face icons",
      "Each event should have its own icon block",
    ],
    requiredBlocks: ["on-button-a", "on-button-b", "show-icon"],
  },
  {
    id: "virtual-pet-basic",
    week: 1,
    title: "Virtual Pet - Getting Started",
    description: "Create the foundation for a Tamagotchi-style pet",
    difficulty: "beginner",
    objective:
      "Display a happy pet icon on start, and show different animations when buttons are pressed",
    hints: [
      "Start with a happy face when the program starts",
      "Button A could feed the pet (show eating animation)",
      "Button B could play with the pet (show different icons)",
      "Use pause blocks between icons for animation effect",
    ],
    requiredBlocks: ["on-start", "on-button-a", "on-button-b", "show-icon", "pause"],
  },

  // Week 2 Activities
  {
    id: "input-output-demo",
    week: 2,
    title: "Input-Output Machine",
    description: "Demonstrate the input-process-output cycle",
    difficulty: "beginner",
    objective:
      "Create a program that takes button input and produces a unique output for each button",
    hints: [
      "Use different input events (button A, button B, shake)",
      "Each input should produce a different output",
      "Think about what processing happens between input and output",
    ],
    requiredBlocks: ["on-button-a", "on-button-b", "show-string"],
  },

  // Week 3 Activities
  {
    id: "counter-game",
    week: 3,
    title: "Button Counter",
    description: "Count how many times a button is pressed",
    difficulty: "intermediate",
    objective:
      "Create a counter that increases by 1 each time button A is pressed and resets when button B is pressed",
    hints: [
      "Set a variable called 'count' to 0 when the program starts",
      "When button A is pressed, change count by 1 and display it",
      "When button B is pressed, set count back to 0 and display it",
    ],
    requiredBlocks: [
      "on-start",
      "on-button-a",
      "on-button-b",
      "set-variable",
      "change-variable",
      "show-number",
    ],
  },
  {
    id: "score-doubler",
    week: 3,
    title: "Score Doubler",
    description: "Practice math operations with variables",
    difficulty: "intermediate",
    objective:
      "Create a program where button A adds 10 points and button B doubles the current score",
    hints: [
      "Initialize score to 0 at start",
      "Button A: change score by 10",
      "Button B: set score to score × 2",
      "Always show the score after changing it",
    ],
    requiredBlocks: ["on-start", "on-button-a", "on-button-b", "set-variable", "show-number"],
  },

  // Week 4 Activities
  {
    id: "temperature-checker",
    week: 4,
    title: "Temperature Alert",
    description: "Use conditionals to check temperature ranges",
    difficulty: "intermediate",
    objective: "Show 'HOT' if temperature is above 25°C, otherwise show 'COOL'",
    hints: [
      "Read the temperature value",
      "Use an if...else block to check if temperature > 25",
      "Show different strings based on the condition",
      "Put this in a forever loop or button press event",
    ],
    requiredBlocks: ["on-button-a", "if-else", "show-string"],
  },
  {
    id: "win-lose-game",
    week: 4,
    title: "Score-Based Game",
    description: "Create a simple game with win/lose conditions",
    difficulty: "intermediate",
    objective:
      "Create a game where you collect points, and win if you reach 10 points",
    hints: [
      "Use a variable for score starting at 0",
      "Button A adds points",
      "After changing score, use if...then to check if score >= 10",
      "Show 'WIN!' icon when condition is met",
    ],
    requiredBlocks: ["on-start", "on-button-a", "set-variable", "change-variable", "if"],
  },

  // Week 5 Activities
  {
    id: "countdown-timer",
    week: 5,
    title: "Countdown Timer",
    description: "Build a countdown from 10 to 0",
    difficulty: "intermediate",
    objective:
      "When button A is pressed, count down from 10 to 0, showing each number for 1 second",
    hints: [
      "Use the 'on button A pressed' event",
      "Create a variable and set it to 10",
      "Use a 'repeat 10 times' loop",
      "Inside the loop: show the number, pause 1000ms, then change the variable by -1",
    ],
    requiredBlocks: [
      "on-button-a",
      "set-variable",
      "repeat",
      "show-number",
      "pause",
      "change-variable",
    ],
  },
  {
    id: "beating-heart",
    week: 5,
    title: "Beating Heart Animation",
    description: "Create a heart animation that beats forever",
    difficulty: "beginner",
    objective:
      "Create an animation of a heart that gets bigger and smaller continuously",
    hints: [
      "Use a 'forever' loop to make it repeat",
      "Show a small heart icon, then pause",
      "Show a large heart icon, then pause",
      "Try 500ms pauses for a realistic beating effect",
    ],
    requiredBlocks: ["on-start", "forever", "show-icon", "pause"],
  },

  // Week 6 Activities
  {
    id: "dice-roller",
    week: 6,
    title: "Digital Dice",
    description: "Create a dice that rolls when shaken",
    difficulty: "beginner",
    objective: "Show a random number from 1 to 6 when the micro:bit is shaken",
    hints: [
      "Use the 'on shake' event",
      "Use 'pick random 1 to 6' to generate the dice roll",
      "Display the random number on the screen",
    ],
    requiredBlocks: ["on-shake", "random", "show-number"],
  },
  {
    id: "rock-paper-scissors",
    week: 6,
    title: "Rock-Paper-Scissors",
    description: "Create a game that picks rock, paper, or scissors randomly",
    difficulty: "intermediate",
    objective:
      "When shaken, randomly show rock, paper, or scissors using custom LED patterns or icons",
    hints: [
      "Use 'on shake' to trigger the game",
      "Pick random 0 to 2",
      "Use if blocks: if 0 show rock, if 1 show paper, if 2 show scissors",
      "You can use show icon or show leds for each option",
    ],
    requiredBlocks: ["on-shake", "random", "if", "show-icon"],
  },
  {
    id: "thermometer",
    week: 6,
    title: "Digital Thermometer",
    description: "Display the current temperature continuously",
    difficulty: "beginner",
    objective: "Show the current temperature on the display, updating every 2 seconds",
    hints: [
      "Use a 'forever' loop",
      "Read the temperature and show it",
      "Add a pause of 2000ms between readings",
    ],
    requiredBlocks: ["on-start", "forever", "show-number", "pause"],
  },

  // Week 7 Activities
  {
    id: "radio-messenger",
    week: 7,
    title: "Radio Messenger",
    description: "Send messages between two micro:bits",
    difficulty: "intermediate",
    objective:
      "Send a number when button A is pressed, and display received numbers from other micro:bits",
    hints: [
      "Set radio group to 1 on start (same group for both devices)",
      "On button A pressed: radio send a number",
      "On radio received: show the received number",
      "Test with a friend or second micro:bit",
    ],
    requiredBlocks: ["on-start", "on-button-a", "on-radio-received", "radio-send", "show-number"],
  },
  {
    id: "remote-display",
    week: 7,
    title: "Remote Display",
    description: "Control another micro:bit's display wirelessly",
    difficulty: "intermediate",
    objective:
      "Send different icons when buttons are pressed, and display received icons on another micro:bit",
    hints: [
      "Both micro:bits need the same radio group",
      "Sender: Send different numbers for different icons (1=heart, 2=star, etc.)",
      "Receiver: Use if blocks to show different icons based on received number",
    ],
    requiredBlocks: [
      "on-start",
      "on-button-a",
      "on-button-b",
      "on-radio-received",
      "radio-send",
      "if",
      "show-icon",
    ],
  },
  {
    id: "wireless-game",
    week: 7,
    title: "Two-Player Wireless Game",
    description: "Create a simple two-player game using radio",
    difficulty: "advanced",
    objective:
      "Create a reaction game where one player sends a signal and the other responds",
    hints: [
      "Player 1: Press button to send 'start' signal",
      "Player 2: When received, shake to respond",
      "Send confirmation back",
      "Use variables to track scores on each device",
    ],
    requiredBlocks: [
      "on-start",
      "on-button-a",
      "on-shake",
      "on-radio-received",
      "radio-send",
      "radio-send-string",
      "set-variable",
      "show-number",
    ],
  },
];
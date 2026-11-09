import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import * as Icons from "lucide-react";

interface MicrobitSimulatorProps {
  isRunning: boolean;
  currentDisplay?: string | number;
  currentIcon?: string;
  onButtonPress?: (button: "A" | "B") => void;
  onPinPress?: (pin: 0 | 1 | 2) => void;
}

export function MicrobitSimulator({
  isRunning,
  currentDisplay,
  currentIcon,
  onButtonPress,
  onPinPress,
}: MicrobitSimulatorProps) {
  const [leds, setLeds] = useState<boolean[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(false))
  );
  const [pressedPin, setPressedPin] = useState<number | null>(null);

  useEffect(() => {
    if (currentDisplay !== undefined) {
      if (typeof currentDisplay === "string") {
        displayScrollingText(currentDisplay);
      } else {
        displayNumber(currentDisplay);
      }
    } else if (currentIcon) {
      displayIcon(currentIcon);
    } else if (!isRunning) {
      clearDisplay();
    }
  }, [currentDisplay, currentIcon, isRunning]);

  const clearDisplay = () => {
    setLeds(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill(false))
    );
  };

  const displayIcon = (icon: string) => {
    const patterns: Record<string, boolean[][]> = {
      Heart: [
        [false, true, false, true, false],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [false, true, true, true, false],
        [false, false, true, false, false],
      ],
      SmallHeart: [
        [false, false, false, false, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, true, false, false],
        [false, false, false, false, false],
      ],
      Smile: [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      Happy: [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      Frown: [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [true, false, false, false, true],
      ],
      Sad: [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [true, false, false, false, true],
      ],
      Star: [
        [false, false, true, false, false],
        [false, true, true, true, false],
        [true, true, true, true, true],
        [false, true, true, true, false],
        [false, true, false, true, false],
      ],
      Check: [
        [false, false, false, false, false],
        [false, false, false, false, true],
        [false, false, false, true, false],
        [true, false, true, false, false],
        [false, true, false, false, false],
      ],
      Yes: [
        [false, false, false, false, false],
        [false, false, false, false, true],
        [false, false, false, true, false],
        [true, false, true, false, false],
        [false, true, false, false, false],
      ],
      Plus: [
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true, true, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
      ],
      Calculator: [
        [true, true, true, true, true],
        [true, false, true, false, true],
        [true, true, true, true, true],
        [true, false, true, false, true],
        [true, true, true, true, true],
      ],
    };

    setLeds(
      patterns[icon] ||
        Array(5)
          .fill(null)
          .map(() => Array(5).fill(false))
    );
  };

  const displayNumber = (num: number) => {
    // Simple number display - center single digit
    const patterns: Record<number, boolean[][]> = {
      0: [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      1: [
        [false, false, true, false, false],
        [false, true, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
      ],
      2: [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, false, true, true, false],
        [false, true, false, false, false],
        [true, true, true, true, true],
      ],
      3: [
        [true, true, true, true, false],
        [false, false, false, false, true],
        [false, true, true, true, false],
        [false, false, false, false, true],
        [true, true, true, true, false],
      ],
      4: [
        [true, false, false, true, false],
        [true, false, false, true, false],
        [true, true, true, true, true],
        [false, false, false, true, false],
        [false, false, false, true, false],
      ],
      5: [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [false, false, false, false, true],
        [true, true, true, true, false],
      ],
      6: [
        [false, true, true, true, false],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      7: [
        [true, true, true, true, true],
        [false, false, false, false, true],
        [false, false, false, true, false],
        [false, false, true, false, false],
        [false, true, false, false, false],
      ],
      8: [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      9: [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, true],
        [false, false, false, false, true],
        [false, true, true, true, false],
      ],
    };

    if (num >= 0 && num <= 9) {
      setLeds(patterns[num]);
    } else {
      // For numbers > 9 or negative, show the number scrolling
      displayScrollingText(num.toString());
    }
  };

  const displayScrollingText = async (text: string) => {
    if (text.length === 0) {
      clearDisplay();
      return;
    }

    // Letter patterns for 5x5 LED grid
    const letterPatterns: Record<string, boolean[][]> = {
      'A': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
      ],
      'B': [
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, false],
      ],
      'C': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      'D': [
        [true, true, true, false, false],
        [true, false, false, true, false],
        [true, false, false, false, true],
        [true, false, false, true, false],
        [true, true, true, false, false],
      ],
      'E': [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [true, false, false, false, false],
        [true, true, true, true, true],
      ],
      'F': [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [true, false, false, false, false],
        [true, false, false, false, false],
      ],
      'G': [
        [false, true, true, true, false],
        [true, false, false, false, false],
        [true, false, true, true, true],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      'H': [
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
      ],
      'I': [
        [false, true, true, true, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
      ],
      'J': [
        [false, false, true, true, true],
        [false, false, false, true, false],
        [false, false, false, true, false],
        [true, false, false, true, false],
        [false, true, true, false, false],
      ],
      'K': [
        [true, false, false, false, true],
        [true, false, false, true, false],
        [true, true, true, false, false],
        [true, false, false, true, false],
        [true, false, false, false, true],
      ],
      'L': [
        [true, false, false, false, false],
        [true, false, false, false, false],
        [true, false, false, false, false],
        [true, false, false, false, false],
        [true, true, true, true, true],
      ],
      'M': [
        [true, false, false, false, true],
        [true, true, false, true, true],
        [true, false, true, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
      ],
      'N': [
        [true, false, false, false, true],
        [true, true, false, false, true],
        [true, false, true, false, true],
        [true, false, false, true, true],
        [true, false, false, false, true],
      ],
      'O': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      'P': [
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, false, false],
        [true, false, false, false, false],
      ],
      'Q': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, true, false],
        [false, true, true, false, true],
      ],
      'R': [
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, true, false],
        [true, false, false, false, true],
      ],
      'S': [
        [false, true, true, true, true],
        [true, false, false, false, false],
        [false, true, true, true, false],
        [false, false, false, false, true],
        [true, true, true, true, false],
      ],
      'T': [
        [true, true, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
      ],
      'U': [
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      'V': [
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      'W': [
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, true, false, true],
        [true, true, false, true, true],
        [true, false, false, false, true],
      ],
      'X': [
        [true, false, false, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, false, false, true],
      ],
      'Y': [
        [true, false, false, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
      ],
      'Z': [
        [true, true, true, true, true],
        [false, false, false, true, false],
        [false, false, true, false, false],
        [false, true, false, false, false],
        [true, true, true, true, true],
      ],
      ' ': [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ],
      '!': [
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
      ],
      '?': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, false, false, true, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
      ],
      '0': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      '1': [
        [false, false, true, false, false],
        [false, true, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
      ],
      '2': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, false, true, true, false],
        [false, true, false, false, false],
        [true, true, true, true, true],
      ],
      '3': [
        [true, true, true, true, false],
        [false, false, false, false, true],
        [false, true, true, true, false],
        [false, false, false, false, true],
        [true, true, true, true, false],
      ],
      '4': [
        [true, false, false, true, false],
        [true, false, false, true, false],
        [true, true, true, true, true],
        [false, false, false, true, false],
        [false, false, false, true, false],
      ],
      '5': [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [false, false, false, false, true],
        [true, true, true, true, false],
      ],
      '6': [
        [false, true, true, true, false],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      '7': [
        [true, true, true, true, true],
        [false, false, false, false, true],
        [false, false, false, true, false],
        [false, false, true, false, false],
        [false, true, false, false, false],
      ],
      '8': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ],
      '9': [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, true, true, true, true],
        [false, false, false, false, true],
        [false, true, true, true, false],
      ],
    };

    // Display each character one at a time with scrolling effect
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      const pattern = letterPatterns[char] || letterPatterns[' '];
      setLeds(pattern);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Clear the display between letters
      clearDisplay();
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const handlePinClick = (pin: 0 | 1 | 2) => {
    setPressedPin(pin);
    onPinPress?.(pin);
    setTimeout(() => setPressedPin(null), 200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">micro:bit Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* micro:bit Board with Buttons and LEDs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl relative">
          <div className="flex items-center justify-between gap-4">
            {/* Button A - Left Side */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onButtonPress?.("A")}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-lg font-bold text-lg bg-gray-600 hover:bg-gray-500 border-gray-500"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center" />
              </Button>
              <span className="text-xs font-bold text-green-400 mt-1">A</span>
            </div>

            {/* LED Display */}
            <div className="grid grid-cols-5 gap-2">
              {leds.map((row, rowIndex) =>
                row.map((isOn, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${
                      isOn
                        ? "bg-red-500 shadow-lg shadow-red-500/50"
                        : "bg-gray-700/50"
                    }`}
                  />
                ))
              )}
            </div>

            {/* Button B - Right Side */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onButtonPress?.("B")}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-lg font-bold text-lg bg-gray-600 hover:bg-gray-500 border-gray-500"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center" />
              </Button>
              <span className="text-xs font-bold text-green-400 mt-1">B</span>
            </div>
          </div>

          {/* Edge Connector Pins */}
          <div className="flex justify-center items-end gap-1 pt-4 mt-4 border-t border-gray-700">
            {/* Pin 0 */}
            <button
              onClick={() => handlePinClick(0)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-10 h-8 rounded-t-lg border border-yellow-600 transition-all ${
                  pressedPin === 0
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                    : "bg-gradient-to-b from-yellow-500 to-yellow-600 group-hover:from-yellow-400 group-hover:to-yellow-500"
                }`}
              ></div>
              <span className="text-xs font-bold text-yellow-400 mt-1">0</span>
            </button>

            {/* Pin 1 */}
            <button
              onClick={() => handlePinClick(1)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-10 h-8 rounded-t-lg border border-yellow-600 transition-all ${
                  pressedPin === 1
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                    : "bg-gradient-to-b from-yellow-500 to-yellow-600 group-hover:from-yellow-400 group-hover:to-yellow-500"
                }`}
              ></div>
              <span className="text-xs font-bold text-yellow-400 mt-1">1</span>
            </button>

            {/* Pin 2 */}
            <button
              onClick={() => handlePinClick(2)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-10 h-8 rounded-t-lg border border-yellow-600 transition-all ${
                  pressedPin === 2
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                    : "bg-gradient-to-b from-yellow-500 to-yellow-600 group-hover:from-yellow-400 group-hover:to-yellow-500"
                }`}
              ></div>
              <span className="text-xs font-bold text-yellow-400 mt-1">2</span>
            </button>

            {/* 3V Power Pin */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-lg border border-yellow-600"></div>
              <span className="text-xs font-bold text-red-400 mt-1">3V</span>
            </div>

            {/* GND Ground Pin */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-lg border border-yellow-600"></div>
              <span className="text-xs font-bold text-blue-400 mt-1">GND</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span>{isRunning ? "Running" : "Stopped"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
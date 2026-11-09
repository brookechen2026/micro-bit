import { useDrag } from "react-dnd";
import { CodeBlock } from "../data/lessons";
import * as Icons from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useState } from "react";

interface BlockPaletteProps {
  blocks: CodeBlock[];
  allowedBlocks?: string[];
}

interface DraggableBlockProps {
  block: CodeBlock;
  isLocked?: boolean;
}

function DraggableBlock({ block, isLocked = false }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: { ...block, instanceId: `${block.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !isLocked,
  }));

  const IconComponent = Icons[block.icon as keyof typeof Icons] as any;

  return (
    <div
      ref={!isLocked ? drag : null}
      className={`${block.color} text-white rounded-lg p-3 flex items-center gap-2 shadow-sm ${
        isLocked
          ? "opacity-30 cursor-not-allowed"
          : "cursor-move hover:opacity-90 transition-opacity"
      } ${isDragging ? "opacity-50" : ""}`}
      title={isLocked ? "Complete the current step to unlock" : ""}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />}
      <span className="text-sm font-medium">{block.text}</span>
      {isLocked && <Icons.Lock className="w-3 h-3 ml-auto" />}
    </div>
  );
}

export function BlockPalette({ blocks, allowedBlocks }: BlockPaletteProps) {
  const blocksByType = blocks.reduce((acc, block) => {
    if (!acc[block.type]) {
      acc[block.type] = [];
    }
    acc[block.type].push(block);
    return acc;
  }, {} as Record<string, CodeBlock[]>);

  const typeLabels: Record<string, { label: string; color: string }> = {
    event: { label: "Events", color: "bg-green-500" },
    basic: { label: "Basic", color: "bg-blue-500" },
    loop: { label: "Loops", color: "bg-purple-500" },
    logic: { label: "Logic", color: "bg-yellow-500" },
    variable: { label: "Variables", color: "bg-orange-500" },
    radio: { label: "Radio", color: "bg-teal-500" },
    math: { label: "Math", color: "bg-pink-500" },
  };

  // Get available categories in a consistent order
  const categoryOrder = ["event", "basic", "loop", "logic", "variable", "radio", "math"];
  const availableCategories = categoryOrder.filter(type => blocksByType[type]);
  
  const [activeCategory, setActiveCategory] = useState(availableCategories[0] || "event");

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Block Palette</h3>
      
      {/* Category Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {availableCategories.map((type) => (
          <button
            key={type}
            onClick={() => setActiveCategory(type)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === type
                ? `${typeLabels[type]?.color || "bg-gray-500"} text-white shadow-md`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {typeLabels[type]?.label || type}
          </button>
        ))}
      </div>

      {/* Active Category Blocks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {typeLabels[activeCategory]?.label || activeCategory}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
          {blocksByType[activeCategory]?.map((block) => (
            <DraggableBlock
              key={block.id}
              block={block}
              isLocked={allowedBlocks ? !allowedBlocks.includes(block.id) : false}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import * as Icons from "lucide-react";
import { X, GripVertical } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CodeBlockProps {
  block: any;
  index: number;
  onRemove: (instanceId: string) => void;
  onUpdateParams: (instanceId: string, params: any) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
}

const iconOptions = [
  "Heart",
  "SmallHeart",
  "Smile",
  "Frown",
  "Star",
  "Diamond",
  "Check",
  "X",
];

export function CodeBlock({ block, index, onRemove, onUpdateParams, onMoveBlock }: CodeBlockProps) {
  const [params, setParams] = useState(block.userParams || {});
  const IconComponent = Icons[block.icon as keyof typeof Icons] as any;
  const ref = useRef<HTMLDivElement>(null);

  const handleParamChange = (paramName: string, value: any) => {
    const newParams = { ...params, [paramName]: value };
    setParams(newParams);
    onUpdateParams(block.instanceId, newParams);
  };

  // Drag functionality for reordering within workspace
  const [{ isDragging }, drag, preview] = useDrag({
    type: "workspace-block",
    item: { index, instanceId: block.instanceId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop functionality for reordering
  const [{ isOver }, drop] = useDrop({
    accept: "workspace-block",
    hover: (item: { index: number; instanceId: string }, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Get rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      onMoveBlock(dragIndex, hoverIndex);
      
      // Update the index for the dragged item
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  // Helper to safely get number value
  const getNumberValue = (paramName: string, defaultValue: number = 0) => {
    const value = params[paramName] ?? block.params?.find((p: any) => p.name === paramName)?.default;
    const numValue = typeof value === 'number' ? value : parseInt(value);
    return isNaN(numValue) ? defaultValue : numValue;
  };

  return (
    <div 
      ref={ref}
      className={`${block.color} text-white rounded-lg p-3 shadow-md relative group transition-opacity ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${isOver ? "ring-2 ring-white" : ""}`}
    >
      {/* Drag Handle */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <GripVertical className="w-5 h-5 text-white drop-shadow-md" />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(block.instanceId)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-center gap-2 flex-wrap">
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <span className="font-medium">{block.text}</span>

        {block.params?.map((param: any) => (
          <div key={param.name} className="inline-flex items-center gap-1">
            {param.type === "string" && (
              <Input
                type="text"
                placeholder={param.default}
                value={params[param.name] !== undefined ? params[param.name] : param.default}
                onChange={(e) => handleParamChange(param.name, e.target.value)}
                className="w-32 h-7 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            )}
            {param.type === "number" && (
              <Input
                type="text"
                inputMode="numeric"
                placeholder={param.default?.toString()}
                value={params[param.name] !== undefined ? params[param.name] : param.default}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string, minus sign, and valid numbers
                  if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
                    handleParamChange(param.name, value === '' ? '' : value === '-' ? '-' : parseInt(value));
                  }
                }}
                onBlur={(e) => {
                  // On blur, ensure valid number or reset to default
                  const value = e.target.value;
                  if (value === '' || value === '-' || isNaN(parseInt(value))) {
                    handleParamChange(param.name, param.default ?? 0);
                  }
                }}
                className="w-20 h-7 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            )}
            {param.type === "icon" && (
              <Select
                value={params[param.name] || param.default}
                onValueChange={(value) => handleParamChange(param.name, value)}
              >
                <SelectTrigger className="w-32 h-7 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
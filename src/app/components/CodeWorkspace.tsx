import { useState, useCallback, useEffect } from "react";
import { useDrop } from "react-dnd";
import { CodeBlock as CodeBlockType } from "../data/lessons";
import { CodeBlock } from "./CodeBlock";
import { Button } from "./ui/button";
import { Play, Trash2 } from "lucide-react";

interface CodeWorkspaceProps {
  onRun: (blocks: any[]) => void;
  initialBlocks?: any[];
  onBlocksChange?: (blocks: any[]) => void;
  guidedMode?: boolean;
}

export function CodeWorkspace({ onRun, initialBlocks = [], onBlocksChange, guidedMode = false }: CodeWorkspaceProps) {
  const [blocks, setBlocks] = useState<any[]>(initialBlocks);

  // Notify parent of block changes after render
  useEffect(() => {
    if (onBlocksChange) {
      onBlocksChange(blocks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "block",
    drop: (item: any) => {
      setBlocks((prev) => [...prev, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const removeBlock = (instanceId: string) => {
    setBlocks((prev) => prev.filter((block) => block.instanceId !== instanceId));
  };

  const updateBlockParams = (instanceId: string, params: any) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.instanceId === instanceId ? { ...block, userParams: params } : block
      )
    );
  };

  // Handle reordering of blocks within workspace
  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks];
      const draggedBlock = newBlocks[dragIndex];
      
      // Remove the dragged block from its position
      newBlocks.splice(dragIndex, 1);
      
      // Insert it at the hover position
      newBlocks.splice(hoverIndex, 0, draggedBlock);
      
      return newBlocks;
    });
  }, []);

  const clearWorkspace = () => {
    setBlocks([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Code Workspace</h3>
        <div className="flex gap-2">
          <Button
            onClick={clearWorkspace}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={blocks.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          <Button
            onClick={() => onRun(blocks)}
            size="sm"
            className="gap-2"
            disabled={blocks.length === 0}
          >
            <Play className="w-4 h-4" />
            Run Code
          </Button>
        </div>
      </div>

      <div
        ref={drop}
        className={`min-h-[400px] bg-gray-50 border-2 border-dashed rounded-lg p-4 transition-all ${
          guidedMode && blocks.length === 0
            ? "border-blue-400 bg-blue-50 animate-pulse"
            : isOver
            ? "border-red-400 bg-red-50"
            : "border-gray-300"
        }`}
      >
        {blocks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Drag blocks here to build your program</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <CodeBlock
                key={block.instanceId}
                block={block}
                index={index}
                onRemove={removeBlock}
                onUpdateParams={updateBlockParams}
                onMoveBlock={moveBlock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
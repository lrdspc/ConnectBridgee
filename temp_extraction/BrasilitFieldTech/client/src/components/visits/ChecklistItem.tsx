import { Checkbox } from "@/components/ui/checkbox";
import { ChecklistItem as ChecklistItemType } from "../../lib/db";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onChange: (id: string, completed: boolean) => void;
}

const ChecklistItem = ({ item, onChange }: ChecklistItemProps) => {
  return (
    <div className="flex items-start">
      <Checkbox
        id={`checklist-${item.id}`}
        className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary rounded"
        checked={item.completed}
        onCheckedChange={(checked) => onChange(item.id, checked as boolean)}
      />
      <div>
        <label 
          htmlFor={`checklist-${item.id}`}
          className="text-sm font-medium text-neutral-800 cursor-pointer"
        >
          {item.text}
        </label>
        {item.description && (
          <p className="text-xs text-neutral-500">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default ChecklistItem;

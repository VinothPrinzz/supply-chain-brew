import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  disabled?: boolean;
}

const QtyStepper: React.FC<Props> = ({ value, onChange, min = 0, disabled }) => (
  <div className="inline-flex items-center border rounded-md overflow-hidden">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-none"
      disabled={disabled || value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
    >
      <Minus className="h-3 w-3" />
    </Button>
    <div className="w-10 text-center text-sm font-medium">{value}</div>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-none"
      disabled={disabled}
      onClick={() => onChange(value + 1)}
    >
      <Plus className="h-3 w-3" />
    </Button>
  </div>
);

export default QtyStepper;

import { useMemo, useState } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  closingCountdown?: string | null;
}

const DateStrip: React.FC<Props> = ({ value, onChange, closingCountdown }) => {
  const [open, setOpen] = useState(false);
  const selected = parseISO(value);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => addDays(today, i));
  }, []);

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 border-b bg-background">
      {dates.map((d, i) => {
        const iso = format(d, "yyyy-MM-dd");
        const active = isSameDay(d, selected);
        const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE d");
        return (
          <button
            key={iso}
            onClick={() => onChange(iso)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full border text-xs flex flex-col items-center min-w-[64px]",
              active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground"
            )}
          >
            <span className="font-medium">{label}</span>
            {i === 0 && closingCountdown && (
              <span className={cn("text-[9px] mt-0.5", active ? "opacity-90" : "text-amber-600")}>
                {closingCountdown}
              </span>
            )}
          </button>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="shrink-0 h-9 w-9 rounded-full border flex items-center justify-center">
            <CalendarIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateStrip;

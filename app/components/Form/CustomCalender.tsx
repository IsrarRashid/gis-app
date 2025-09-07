import { forwardRef, useState, useEffect, useRef } from "react";
import { Calendar, CalendarProps } from "react-date-range";
import { createPortal } from "react-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { MdOutlineDateRange } from "react-icons/md";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import CustomInput from "./CustomInput";

interface Props extends Omit<CalendarProps, "date" | "onChange"> {
  value?: string | Date | null;
  onChange: (date: Date) => void;
}

const CustomCalendar = forwardRef<HTMLDivElement, Props>(
  ({ value, onChange, ...rest }, ref) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const selectedDate =
      value instanceof Date ? value : value ? new Date(value) : null;

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          popupRef.current &&
          !popupRef.current.contains(e.target as Node) &&
          !inputRef.current?.contains(e.target as Node)
        ) {
          setShowCalendar(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Positioning for portal popup (below input)
    const getPopupStyle = () => {
      if (!inputRef.current) return {};
      const rect = inputRef.current.getBoundingClientRect();
      return {
        position: "absolute" as const,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 99999,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      };
    };

    return (
      <div className="position-relative" ref={ref}>
        <CustomInput
          ref={inputRef}
          type="text"
          readOnly
          value={selectedDate ? getFormattedDate(selectedDate) : ""}
          onClick={() => setShowCalendar(!showCalendar)}
        />
        <div
          className="btn position-absolute rounded-3"
          style={{ top: 0, zIndex: 3, right: 5 }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <MdOutlineDateRange style={{ color: "#545861" }} />
        </div>
        {showCalendar &&
          createPortal(
            <div ref={popupRef} style={getPopupStyle()}>
              <Calendar
                date={selectedDate || new Date()}
                onChange={(date) => {
                  onChange(date);
                  setShowCalendar(false);
                }}
                {...rest}
              />
            </div>,
            document.body
          )}
      </div>
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";

export default CustomCalendar;

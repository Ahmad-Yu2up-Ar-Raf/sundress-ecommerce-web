import NumberFlow from "@number-flow/react"
import clsx from "clsx"
import { Minus, Plus } from "lucide-react"
import * as React from "react"
import { Button } from "../shadcn-ui/button"
import { Input } from "../shadcn-ui/input"

type Props = {
  value?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
}

export function InputToggle({
  value = 0,
  min = -Infinity,
  max = Infinity,
  onChange,
}: Props) {
  const defaultValue = React.useRef(value)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [animated, setAnimated] = React.useState(true)
  // Hide the caret during transitions so you can't see it shifting around:
  const [showCaret, setShowCaret] = React.useState(false)
  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setAnimated(false)
    if (el.value === "") {
      onChange?.(defaultValue.current)
      return
    }
    const num = parseInt(el.value)
    if (
      isNaN(num) ||
      (min != null && num < min) ||
      (max != null && num > max)
    ) {
      // Revert input's value:
      el.value = String(value)
    } else {
      // Manually update value in case they e.g. start with a "0" or end with a "."
      // which won't trigger a DOM update (because the number is the same):
      el.value = String(num)
      onChange?.(num)
    }
  }
  const handlePointerDown =
    (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      setAnimated(true)
      if (event.pointerType === "mouse") {
        event?.preventDefault()
        inputRef.current?.focus()
      }
      const newVal = Math.min(Math.max(value + diff, min), max)
      onChange?.(newVal)
    }
  return (
    <div className="group items-center flex border  rounded-xl text-sm font-semibold h-fit  w-fit transition-[box-shadow] focus-within:ring-2  dark:ring-zinc-800">
      <Button
        size={"icon"}
      variant={"ghost"}
        aria-hidden
        tabIndex={-1}
        className="flex size-7 text-muted-foreground items-center has-[>svg]:px-0  p-0"
        disabled={min != null && value <= min}
        onPointerDown={handlePointerDown(-1)}
      >
        <Minus className="size-3" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
      <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <Input
          ref={inputRef}
          className={clsx(
            showCaret ? "caret-primary" : "caret-transparent",
            "spin-hide ring-0 w-[1.5em] border-0 bg-transparent py-0 text-center font-[inherit] h-0 text-transparent outline-none",
          )}
          // Make sure to disable kerning, to match NumberFlow:
          style={{ fontKerning: "none" }}
          type="number"
          min={min}
          step={1}
          autoComplete="off"
          inputMode="numeric"
          max={max}
          value={value}
          onInput={handleInput}
        />
        <NumberFlow
          value={value}
          format={{ useGrouping: false }}
          aria-hidden
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className="pointer-events-none"
          willChange
        />
      </div>
      <Button
          size={"icon"}
       variant={"ghost"}
        aria-hidden
        tabIndex={-1}
        className="flex size-7  items-center text-muted-foreground p-0  "
        disabled={max != null && value >= max}
        onPointerDown={handlePointerDown(1)}
      >
        <Plus className="size-3" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
    </div>
  )
}

export default { Input }

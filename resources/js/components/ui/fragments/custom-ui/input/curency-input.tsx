"use client";
import { useReducer } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn-ui/form"; // Shadcn UI import
import { Input } from "../../shadcn-ui/input";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface TextInputProps<T extends FieldValues, >
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  name: string;
  label: string;
  placeholder: string;
  disable: boolean
};

// Indonesian currency config
const moneyFormatter = Intl.NumberFormat("id-ID", {
  currency: "",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 0, // Rupiah biasanya tidak menggunakan desimal
  maximumFractionDigits: 0,
});

export default function MoneyInput<T extends FieldValues, >(props: TextInputProps<T>) {
  const initialValue = props.form.getValues()[props.name]
    ? moneyFormatter.format(props.form.getValues()[props.name])
    : "";

  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits)); // Tidak perlu dibagi 100 karena tidak ada desimal
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits); // Tidak perlu dibagi 100
    realChangeFn(realValue);
  }

  return (
    <FormField
      control={props.form.control}
        name={props.name as FieldPath<T>}
      render={({ field }) => {
        
        const _change = field.onChange;

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
              disabled={props.disable}
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
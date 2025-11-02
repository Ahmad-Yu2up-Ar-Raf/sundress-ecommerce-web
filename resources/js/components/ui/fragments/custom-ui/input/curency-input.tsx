"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn-ui/form";
import { Input } from "../../shadcn-ui/input";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface MoneyInputProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  name: string;
  label?: string;
  placeholder?: string;
  disable?: boolean;
}

export default function MoneyInput<T extends FieldValues>(
  props: MoneyInputProps<T>
) {
  const { form, name, label = "", placeholder = "", disable = false } = props;

  // Formatter untuk USD (2 decimal)
  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Ambil initial raw value dari form (diharapkan number, mis. 1234.56)
  const rawValue = form.getValues()[name] as unknown;
  const initialValue =
    rawValue !== undefined && rawValue !== null && rawValue !== ""
      ? moneyFormatter.format(Number(rawValue))
      : "";

  const [displayValue, setDisplayValue] = useState<string>(initialValue);

  // Sync jika nilai dari form berubah dari luar (mis setValue dipanggil di luar)
  useEffect(() => {
    const current = form.getValues()[name];
    if (current === undefined || current === null || current === "") {
      setDisplayValue("");
    } else {
      const formatted = moneyFormatter.format(Number(current));
      setDisplayValue(formatted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch ? form.watch(name) : null]); // watch jika tersedia, agar terupdate otomatis

  // Mengubah tampilan -> update form dengan nilai numerik (dolar)
  function handleChange(realChangeFn: (v: any) => void, formattedValue: string) {
    // ambil hanya digit (termasuk desimal jika ada) -> kita pakai regex yang ambil digit saja
    const digits = formattedValue.replace(/[^0-9]/g, ""); // "123456" untuk "1,234.56"
    const realValue = digits ? Number(digits) / 100 : 0; // karena kita menyandikan cents
    realChangeFn(realValue);
  }

  return (
    <FormField
      control={form.control}
      name={name as FieldPath<T>}
      render={({ field }) => {
        // hindari override langsung seluruh field props (field.value number), kita ganti onChange & value untuk input
        const { onChange, value: fieldValue, ref, ...restField } = field as any;

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                disabled={disable}
                placeholder={placeholder}
                type="text"
                {...restField}
                // ketika user ketik, kita update display dan form value numeric
                onChange={(ev) => {
                  const input = ev.target.value;
                  // Update tampilan (formatted)
                  // extract digits and format as currency
                  const onlyDigits = input.replace(/[^0-9]/g, "");
                  const numberForFormat = onlyDigits ? Number(onlyDigits) / 100 : 0;
                  const nextDisplay = onlyDigits
                    ? moneyFormatter.format(numberForFormat)
                    : "";
                  setDisplayValue(nextDisplay);
                  // update form value (numeric)
                  handleChange(onChange, input);
                }}
                value={displayValue}
                aria-label={name}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

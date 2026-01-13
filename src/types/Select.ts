export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
}

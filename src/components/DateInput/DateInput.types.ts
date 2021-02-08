export interface IDateInputProps {
  min: number | null, 
  max: number | null,
  value: number[] | null,
  animationSpeed: number,
  onChange(value: number[] | number): void,
  formatLabel(value: number, index: number): React.ReactNode,
  selectedDate: Date,
  handleDateChange(date: Date | null): void,
}

import {
  TextInput,
  PasswordInput,
  Textarea,
  Select,
  MultiSelect,
  NumberInput,
  Checkbox,
  Switch,
  FileInput,
  JsonInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";

interface BaseFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  form: UseFormReturnType<any>;
  withAsterisk?: boolean;
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: "text" | "email" | "tel" | "url";
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

interface PasswordFormFieldProps extends BaseFormFieldProps {
  type: "password";
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  leftSection?: React.ReactNode;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: "textarea";
  rows?: number;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

interface NumberFormFieldProps extends BaseFormFieldProps {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: "select";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
  nothingFoundMessage?: string;
}

interface MultiSelectFormFieldProps extends BaseFormFieldProps {
  type: "multiselect";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
  maxValues?: number;
}

interface DateFormFieldProps extends BaseFormFieldProps {
  type: "date";
  min?: string;
  max?: string;
}

interface CheckboxFormFieldProps extends BaseFormFieldProps {
  type: "checkbox";
  labelPosition?: "left" | "right";
}

interface SwitchFormFieldProps extends BaseFormFieldProps {
  type: "switch";
  onLabel?: string;
  offLabel?: string;
}

interface FileFormFieldProps extends BaseFormFieldProps {
  type: "file";
  accept?: string;
  multiple?: boolean;
  capture?: boolean;
}

interface JsonFormFieldProps extends BaseFormFieldProps {
  type: "json";
  formatOnBlur?: boolean;
  validationError?: string;
}

type FormFieldProps =
  | TextFormFieldProps
  | PasswordFormFieldProps
  | TextareaFormFieldProps
  | NumberFormFieldProps
  | SelectFormFieldProps
  | MultiSelectFormFieldProps
  | DateFormFieldProps
  | CheckboxFormFieldProps
  | SwitchFormFieldProps
  | FileFormFieldProps
  | JsonFormFieldProps;

export function FormField(props: FormFieldProps) {
  const {
    name,
    label,
    placeholder,
    required,
    disabled,
    description,
    form,
    type,
    withAsterisk,
  } = props;

  const baseProps = {
    label,
    placeholder,
    required,
    disabled,
    description,
    withAsterisk: withAsterisk ?? required,
    ...form.getInputProps(name),
  };

  switch (type) {
    case "text":
    case "email":
    case "tel":
    case "url": {
      const textProps = props as TextFormFieldProps;
      return (
        <TextInput
          {...baseProps}
          type={type}
          leftSection={textProps.leftSection}
          rightSection={textProps.rightSection}
        />
      );
    }

    case "password": {
      const passwordProps = props as PasswordFormFieldProps;
      return (
        <PasswordInput
          {...baseProps}
          visible={passwordProps.visible}
          onVisibilityChange={passwordProps.onVisibilityChange}
          leftSection={passwordProps.leftSection}
        />
      );
    }

    case "textarea": {
      const textareaProps = props as TextareaFormFieldProps;
      return (
        <Textarea
          {...baseProps}
          rows={textareaProps.rows}
          autosize={textareaProps.autosize}
          minRows={textareaProps.minRows}
          maxRows={textareaProps.maxRows}
        />
      );
    }

    case "number": {
      const numberProps = props as NumberFormFieldProps;
      return (
        <NumberInput
          {...baseProps}
          min={numberProps.min}
          max={numberProps.max}
          step={numberProps.step}
          decimalScale={numberProps.precision}
          leftSection={numberProps.leftSection}
          rightSection={numberProps.rightSection}
        />
      );
    }

    case "select": {
      const selectProps = props as SelectFormFieldProps;
      return (
        <Select
          {...baseProps}
          data={selectProps.data}
          searchable={selectProps.searchable}
          clearable={selectProps.clearable}
          nothingFoundMessage={selectProps.nothingFoundMessage}
        />
      );
    }

    case "multiselect": {
      const multiSelectProps = props as MultiSelectFormFieldProps;
      return (
        <MultiSelect
          {...baseProps}
          data={multiSelectProps.data}
          searchable={multiSelectProps.searchable}
          clearable={multiSelectProps.clearable}
          maxValues={multiSelectProps.maxValues}
        />
      );
    }

    case "date": {
      const dateProps = props as DateFormFieldProps;
      return (
        <TextInput
          {...baseProps}
          type="date"
          min={dateProps.min}
          max={dateProps.max}
        />
      );
    }

    case "checkbox": {
      const checkboxProps = props as CheckboxFormFieldProps;
      return (
        <Checkbox
          {...form.getInputProps(name, { type: "checkbox" })}
          label={label}
          description={description}
          disabled={disabled}
          labelPosition={checkboxProps.labelPosition}
        />
      );
    }

    case "switch": {
      const switchProps = props as SwitchFormFieldProps;
      return (
        <Switch
          {...form.getInputProps(name, { type: "checkbox" })}
          label={label}
          description={description}
          disabled={disabled}
          onLabel={switchProps.onLabel}
          offLabel={switchProps.offLabel}
        />
      );
    }

    case "file": {
      const fileProps = props as FileFormFieldProps;
      return (
        <FileInput
          {...baseProps}
          leftSection={<IconUpload size={16} />}
          accept={fileProps.accept}
          multiple={fileProps.multiple}
          capture={fileProps.capture}
        />
      );
    }

    case "json": {
      const jsonProps = props as JsonFormFieldProps;
      return (
        <JsonInput
          {...baseProps}
          formatOnBlur={jsonProps.formatOnBlur}
          validationError={jsonProps.validationError}
        />
      );
    }

    default:
      return <TextInput {...baseProps} />;
  }
}

// Legacy alias for backward compatibility
export const EnhancedFormField = FormField;

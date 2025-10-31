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

interface BaseEnhancedFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  form: UseFormReturnType<any>;
  withAsterisk?: boolean;
}

interface TextEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "text" | "email" | "tel" | "url";
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

interface PasswordEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "password";
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  leftSection?: React.ReactNode;
}

interface TextareaEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "textarea";
  rows?: number;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

interface NumberEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

interface SelectEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "select";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
  nothingFoundMessage?: string;
}

interface MultiSelectEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "multiselect";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
  maxValues?: number;
}

interface DateEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "date";
  min?: string;
  max?: string;
}

interface CheckboxEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "checkbox";
  labelPosition?: "left" | "right";
}

interface SwitchEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "switch";
  onLabel?: string;
  offLabel?: string;
}

interface FileEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "file";
  accept?: string;
  multiple?: boolean;
  capture?: boolean;
}

interface JsonEnhancedFormFieldProps extends BaseEnhancedFormFieldProps {
  type: "json";
  formatOnBlur?: boolean;
  validationError?: string;
}

type EnhancedFormFieldProps =
  | TextEnhancedFormFieldProps
  | PasswordEnhancedFormFieldProps
  | TextareaEnhancedFormFieldProps
  | NumberEnhancedFormFieldProps
  | SelectEnhancedFormFieldProps
  | MultiSelectEnhancedFormFieldProps
  | DateEnhancedFormFieldProps
  | CheckboxEnhancedFormFieldProps
  | SwitchEnhancedFormFieldProps
  | FileEnhancedFormFieldProps
  | JsonEnhancedFormFieldProps;

export function EnhancedFormField(props: EnhancedFormFieldProps) {
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
      const textProps = props as TextEnhancedFormFieldProps;
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
      const passwordProps = props as PasswordEnhancedFormFieldProps;
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
      const textareaProps = props as TextareaEnhancedFormFieldProps;
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
      const numberProps = props as NumberEnhancedFormFieldProps;
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
      const selectProps = props as SelectEnhancedFormFieldProps;
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
      const multiSelectProps = props as MultiSelectEnhancedFormFieldProps;
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
      const dateProps = props as DateEnhancedFormFieldProps;
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
      const checkboxProps = props as CheckboxEnhancedFormFieldProps;
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
      const switchProps = props as SwitchEnhancedFormFieldProps;
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
      const fileProps = props as FileEnhancedFormFieldProps;
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
      const jsonProps = props as JsonEnhancedFormFieldProps;
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

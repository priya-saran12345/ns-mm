import { Button, Checkbox, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

type Opt = { value: string; label: string };
type Props = {
  options: Opt[];
  value: string[];
  onChange: (values: string[]) => void;
};

export default function RoleFilterDropdown({ options, value, onChange }: Props) {
  const content = (
    <div className="min-w-[200px]">
      <Checkbox.Group
        className="flex flex-col gap-2"
        options={options.map((o) => ({ value: o.value, label: o.label }))}
        value={value}
        onChange={(vals: CheckboxValueType[]) => onChange(vals as string[])}
      />
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      content={content}
      overlayInnerStyle={{ padding: 12 }}
    >
      <Button className="flex items-center justify-between gap-2">
        Select Role <DownOutlined />
      </Button>
    </Popover>
  );
}

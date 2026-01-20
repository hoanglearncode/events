import { Switch } from "@/components/ui/switch";

export function StoreToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return <Switch checked={enabled} onCheckedChange={onChange} />;
}

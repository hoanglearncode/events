import { PackageX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
export default function EmptyProduct() {
  const { t } = useTranslation();
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <PackageX className="h-7 w-7 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold">{t("productEmpty")}</h3>

        <p className="text-sm text-muted-foreground max-w-md">
          {t("productEmptyDes")}
        </p>
      </CardContent>
    </Card>
  );
}

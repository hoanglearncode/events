"use client";
import { Wallet } from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RenderWalletTab = (localUser: any) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-0 shadow-xl overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Số dư khả dụng
            </p>
            <h2 className="text-4xl font-bold mb-6">
              {(localUser.balance ?? 0).toLocaleString("vi-VN")}₫
            </h2>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1 font-semibold"
              >
                Nạp tiền
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
              >
                Rút tiền
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lịch sử giao dịch</span>
            <Badge variant="outline">
              {(localUser.transactions ?? []).length} giao dịch
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(localUser.transactions ?? []).length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">Chưa có giao dịch nào</p>
              <p className="text-sm text-muted-foreground">
                Lịch sử giao dịch của bạn sẽ xuất hiện ở đây
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {localUser.transactions.map((trans: any) => (
                <div
                  key={trans.id}
                  className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${trans.type === "deposit" ? "bg-brand-success/20 text-brand-success" : "bg-brand-error/20 text-brand-error"}`}
                    >
                      {trans.type === "deposit" ? "↓" : "↑"}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-brand-primary transition-colors">
                        {trans.desc}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {trans.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${trans.type === "deposit" ? "text-brand-success" : "text-brand-error"}`}
                    >
                      {trans.type === "deposit" ? "+" : "-"}
                      {(trans.amount ?? 0).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default RenderWalletTab;

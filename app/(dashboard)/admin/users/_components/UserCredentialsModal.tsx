// pages/admin/users/_components/UserCredentialsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  CheckCircle2,
  AlertCircle,
  Download,
  Mail,
  Printer,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserCredentialsModalProps {
  open: boolean;
  onClose: () => void;
  credentials: {
    email: string;
    password: string;
  } | null;
}

export function UserCredentialsModal({
  open,
  onClose,
  credentials,
}: UserCredentialsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(true);

  if (!credentials) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `Email: ${credentials.email}\nMật khẩu: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = `THÔNG TIN ĐĂNG NHẬP HỆ THỐNG
========================================

Email đăng nhập: ${credentials.email}
Mật khẩu tạm thời: ${credentials.password}

========================================
LƯU Ý QUAN TRỌNG:
- Đây là mật khẩu tạm thời, chỉ hiển thị một lần duy nhất
- Người dùng BẮT BUỘC phải thay đổi mật khẩu sau lần đăng nhập đầu tiên
- Vui lòng gửi thông tin này cho người dùng qua kênh liên lạc bảo mật
- Không chia sẻ thông tin này qua email hoặc tin nhắn không mã hóa

Ngày tạo: ${new Date().toLocaleString("vi-VN")}
`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thong-tin-dang-nhap-${credentials.email.split("@")[0]}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thông tin đăng nhập</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 2px solid #333;
              padding: 30px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
              font-size: 24px;
            }
            .divider {
              border-top: 2px solid #333;
              margin: 20px 0;
            }
            .info-row {
              margin: 20px 0;
              padding: 15px;
              background: #f5f5f5;
              border-left: 4px solid #333;
            }
            .label {
              font-weight: bold;
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .value {
              font-size: 18px;
              font-family: 'Courier New', monospace;
              color: #333;
              word-break: break-all;
            }
            .warning {
              background: #fff3cd;
              border: 2px solid #ffc107;
              padding: 15px;
              margin-top: 20px;
            }
            .warning-title {
              font-weight: bold;
              color: #856404;
              margin-bottom: 10px;
            }
            .warning ul {
              margin-left: 20px;
              color: #856404;
            }
            .warning li {
              margin: 5px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>THÔNG TIN ĐĂNG NHẬP HỆ THỐNG</h1>
            <div class="divider"></div>
            
            <div class="info-row">
              <div class="label">Email đăng nhập</div>
              <div class="value">${credentials.email}</div>
            </div>
            
            <div class="info-row">
              <div class="label">Mật khẩu tạm thời</div>
              <div class="value">${credentials.password}</div>
            </div>
            
            <div class="warning">
              <div class="warning-title">⚠️ LƯU Ý QUAN TRỌNG</div>
              <ul>
                <li>Đây là mật khẩu tạm thời, chỉ hiển thị một lần duy nhất</li>
                <li>Người dùng BẮT BUỘC phải thay đổi mật khẩu sau lần đăng nhập đầu tiên</li>
                <li>Vui lòng gửi thông tin này cho người dùng qua kênh liên lạc bảo mật</li>
                <li>Không chia sẻ thông tin này qua email hoặc tin nhắn không mã hóa</li>
              </ul>
            </div>
            
            <div class="footer">
              <strong>Ngày tạo:</strong> ${new Date().toLocaleString("vi-VN")}<br>
              <strong>Lưu ý:</strong> Vui lòng bảo mật thông tin này
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Thông tin đăng nhập hệ thống");
    const body = encodeURIComponent(`Xin chào,

Dưới đây là thông tin đăng nhập của bạn:

Email: ${credentials.email}
Mật khẩu tạm thời: ${credentials.password}

LƯU Ý QUAN TRỌNG:
- Đây là mật khẩu tạm thời, bạn cần thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên
- Không chia sẻ thông tin này với bất kỳ ai

Trân trọng,`);

    window.open(`mailto:${credentials.email}?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Tài khoản đã được tạo thành công
          </DialogTitle>
          <DialogDescription>
            Thông tin đăng nhập chỉ hiển thị một lần. Vui lòng lưu lại và gửi
            cho người dùng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Alert */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tài khoản mới đã được tạo thành công. Hãy chọn phương thức lưu trữ
              phù hợp bên dưới.
            </AlertDescription>
          </Alert>

          {/* Credentials Display */}
          <div className="space-y-3 rounded-lg border bg-slate-50 p-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-600">
                Email đăng nhập
              </label>
              <div className="flex gap-2">
                <Input
                  value={credentials.email}
                  readOnly
                  className="bg-white font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(credentials.email, "email")}
                  title="Sao chép email"
                >
                  {copiedField === "email" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-600">
                Mật khẩu tạm thời
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    readOnly
                    className="bg-white pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(credentials.password, "password")}
                  title="Sao chép mật khẩu"
                >
                  {copiedField === "password" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Chọn phương thức lưu trữ:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyAll}
                className="justify-start"
              >
                {copiedField === "all" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Sao chép tất cả
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadTxt}
                className="justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Tải file TXT
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="justify-start"
              >
                <Printer className="mr-2 h-4 w-4" />
                In thông tin
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSendEmail}
                className="justify-start"
              >
                <Mail className="mr-2 h-4 w-4" />
                Soạn email
              </Button>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Cảnh báo bảo mật:</strong> Mật khẩu này chỉ hiển thị một
              lần duy nhất. Người dùng bắt buộc phải thay đổi mật khẩu sau lần
              đăng nhập đầu tiên.
            </AlertDescription>
          </Alert>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose}>Đã lưu, đóng cửa sổ</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

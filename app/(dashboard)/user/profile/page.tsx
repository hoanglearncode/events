"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Wallet,
  User,
  Shield,
  CreditCard,
  Crown,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Feature Components
import PublicHeader from "@/components/features/common/publicHeader";
import ChangePasswordFrom from "@/components/features/auth/change-password-form";
import RenderWalletTab from "./_components/walletTab/renderWalletTab";

// Refactored Components
import ProfileTab from "./_components/profileTab/profileTab";
import BillingTab from "./_components/payments/billing-tab";
import SellerTab from "./_components/seller/seller-tab";
import PaymentMethodModal from "./_components/payments/payment-method";
import SellerRegistrationModal from "./_components/seller/sellerModal";

// Hooks
import {
  useProfileDetails,
  useUpdateProfile,
} from "@/hooks/queries/profileQueries";
import { useMyPaymentInfos } from "@/hooks/queries/usePayment";
import {
  registerSellQueries,
  unRegisterSellQueries,
  useGetDetailsShop,
  useUpdateDetailsShop,
} from "@/hooks/queries/sellerQueries";

import { toast } from "sonner";
import {
  useSavePaymentInfo,
  useDeletePaymentInfo,
} from "@/hooks/queries/usePayment";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  // State để phân biệt mode của modal seller
  const [isEditingSellerMode, setIsEditingSellerMode] = useState(false);

  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [sellerData, setSellerData] = useState<any>({
    shopName: "",
    description: "",
    shopPhone: "",
    shopEmail: "",
    address: "",
    category: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [newPayment, setNewPayment] = useState<any>({
    type: "bank",
    bankName: "",
    accountNumber: "",
    accountName: "",
    isDefault: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Profile Query
  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useProfileDetails(
    activeTab === "profile" || activeTab === "billing" || activeTab === "seller"
  );

  const sellerStatusRaw = details?.sellerStatus || "none";
  const sellerStatus = String(sellerStatusRaw).toLowerCase?.() ?? "";
  const role = details?.role ?? "USER";
  const isAdmin = role === "ADMIN";
  const isSeller = role === "SELLER" || sellerStatus === "pending";
  const isUser = role === "USER";
  const canAccessSellerUI = !isAdmin;

  // Mutations
  const updateProfile = useUpdateProfile();
  const registerSeller = registerSellQueries();
  const unRegisterSeller = unRegisterSellQueries();
  const updateShop = useUpdateDetailsShop();
  const savePaymentMutation = useSavePaymentInfo();
  const deletePaymentMutation = useDeletePaymentInfo();

  // Shop Details Query
  const { data: shopDetails, isLoading: shopLoading } = useGetDetailsShop({
    enabled: activeTab === "seller" && isSeller,
  });

  // Payment Query
  const { data: myPaymentInfos, isLoading: paymentInfosLoading } =
    useMyPaymentInfos(!!details);

  // ========================================
  // EFFECTS
  // ========================================

  // Populate seller data from shopDetails
  useEffect(() => {
    if (!shopDetails) return;
    setSellerData({
      shopName: shopDetails.shopName ?? "",
      description: shopDetails.shopDescription ?? "",
      shopPhone: shopDetails.shopPhone ?? "",
      shopEmail: shopDetails.shopEmail ?? "",
      address: shopDetails.address ?? "",
      category: shopDetails.category ?? "",
    });
  }, [shopDetails]);

  // Populate user data when profile loads
  useEffect(() => {
    if (details) {
      setUserData({
        name: details.fullname ?? "",
        phone: details.phone ?? "",
        email: details.email ?? "",

        shopEmail: details.shopEmail ?? "",
        avatar: details.avatar ?? null,
        balance: 0,
        transactions: [],
      });

      // If backend includes seller info, prefill sellerData
      const sd =
        details?.seller ??
        details?.shop ??
        details?.sellerInfo ??
        details?.seller_data ??
        null;

      if (sd) {
        setSellerData({
          shopName:
            sd.shopName ?? sd.name ?? sd.shop_name ?? sellerData.shopName,
          description: sd.description ?? sellerData.description,
          shopPhone: sd.shopPhone ?? sellerData.shopPhone,
          address: sd.address ?? sellerData.address,
          category: sd.category ?? sellerData.category,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  // Auto-switch to seller tab if user is seller/pending
  useEffect(() => {
    if (!details) return;

    if (!isAdmin && (isSeller || sellerStatus === "pending")) {
      setActiveTab("seller");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, isSeller, sellerStatus]);

  // Map payment infos
  useEffect(() => {
    if (myPaymentInfos && Array.isArray(myPaymentInfos)) {
      const mapped = myPaymentInfos.map((p: any) => ({
        id: p.id,
        type: p.provider?.toLowerCase() === "paypal" ? "paypal" : "bank",
        bankName: p.bankCode || p.provider || "",
        accountNumber: p.receiverAccount,
        accountName: p.receiverName,
        isDefault: !!p.isDefault,
        raw: p,
      }));
      setPaymentMethods(mapped);
    }
  }, [myPaymentInfos]);

  // Cleanup avatar preview
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch (e) {}
        previewUrlRef.current = null;
      }
    };
  }, []);

  // ========================================
  // PROFILE HANDLERS
  // ========================================

  const userRole = details?.role?.toLowerCase?.() ?? "user";
  const provider = details?.provider ?? "LOCAL";

  const buildProfileFormData = (data: any, file?: File | null) => {
    const fd = new FormData();
    if (data?.name !== undefined) fd.append("name", data.name ?? "");
    if (data?.email !== undefined) fd.append("email", data.email ?? "");
    if (data?.phone !== undefined) fd.append("phone", data.phone ?? "");
    if (file) {
      fd.append("avatar", file);
    }
    return fd;
  };

  const handleSaveProfile = () => {
    if (!userData) return;

    const formData = buildProfileFormData(userData, null);

    updateProfile.mutate(formData, {
      onSuccess: (res: any) => {
        toast.success("Cập nhật profile thành công");
        const updated =
          (res &&
            (res.fullname ??
              res.name ??
              res.data?.fullname ??
              res.data?.name)) ||
          userData.name;
        const updatedEmail =
          (res && (res.email ?? res.data?.email)) || userData.email;
        const updatedPhone =
          (res && (res.phone ?? res.data?.phone)) || userData.phone;
        const updatedAvatar =
          (res && (res.avatar ?? res.data?.avatar)) ?? userData.avatar;
        setUserData((prev: any) => ({
          ...(prev ?? {}),
          name: updated,
          email: updatedEmail,
          phone: updatedPhone,
          avatar: updatedAvatar,
        }));
      },
      onError: (err: any) => {
        console.error("updateProfile error:", err);
        toast.error("Cập nhật profile thất bại");
      },
    });
  };

  const onChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const onAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setUserData((prev: any) => ({ ...(prev ?? {}), avatar: previewUrl }));

    const formData = buildProfileFormData(userData ?? {}, file);
    updateProfile.mutate(formData, {
      onSuccess: (res: any) => {
        toast.success("Cập nhật avatar thành công");
        const avatarFromServer = res?.avatar ?? res?.data?.avatar;
        if (avatarFromServer) {
          setUserData((prev: any) => ({
            ...(prev ?? {}),
            avatar: avatarFromServer,
          }));
        }
      },
      onError: (err: any) => {
        console.error("update avatar error:", err);
        toast.error("Cập nhật avatar thất bại");
        setUserData((prev: any) => ({
          ...(prev ?? {}),
          avatar: details?.avatar ?? prev?.avatar,
        }));
      },
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          if (previewUrlRef.current) {
            try {
              URL.revokeObjectURL(previewUrlRef.current);
            } catch (e) {}
            previewUrlRef.current = null;
          }
        }, 30000);
      },
    });
  };

  // ========================================
  // SELLER HANDLERS
  // ========================================

  /**
   * Mở modal đăng ký seller mới
   */
  const handleRegisterSeller = () => {
    // Nếu đang chờ duyệt
    if (sellerStatus === "pending") {
      toast.info("Yêu cầu Seller của bạn đang chờ admin duyệt.");
      setActiveTab("seller");
      return;
    }

    // Nếu đã là seller active
    if (isSeller && sellerStatus === "active") {
      setActiveTab("seller");
      return;
    }

    // Mở modal ở chế độ đăng ký mới
    setIsEditingSellerMode(false);
    setSellerData({
      shopName: "",
      description: "",
      shopPhone: "",
      shopEmail: "",
      address: "",
      category: "",
    });
    setShowSellerModal(true);
  };

  /**
   * Mở modal chỉnh sửa thông tin seller
   */
  const handleEditSeller = () => {
    // Mở modal ở chế độ chỉnh sửa
    setIsEditingSellerMode(true);

    // Load dữ liệu hiện tại vào form
    setSellerData({
      shopName: shopDetails?.shopName ?? "",
      description: shopDetails?.shopDescription ?? "",
      shopPhone: shopDetails?.shopPhone ?? "",
      shopEmail: shopDetails?.shopEmail ?? "",
      address: shopDetails?.address ?? "",
      category: shopDetails?.category ?? "",
    });

    setShowSellerModal(true);
  };

  /**
   * Submit form seller (đăng ký mới hoặc cập nhật)
   */
  const handleSubmitSeller = async () => {
    // Validate
    if (
      !sellerData.shopName ||
      !sellerData.description ||
      !sellerData.shopPhone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isEditingSellerMode) {
        // CHẾ ĐỘ CHỈNH SỬA
        await updateShop.mutateAsync({
          formData: {
            shopName: sellerData.shopName,
            shopDescription: sellerData.description,
            phone: sellerData.shopPhone,
            address: sellerData.address,
            category: sellerData.category,
          },
        });

        toast.success("Đã cập nhật thông tin cửa hàng");
      } else {
        // CHẾ ĐỘ ĐĂNG KÝ MỚI
        const res: any = await registerSeller.mutateAsync(sellerData);

        toast.success(res?.message ?? "Đăng ký seller thành công");

        // Clear form sau khi đăng ký
        setSellerData({
          shopName: "",
          description: "",
          shopPhone: "",
          shopEmail: "",
          address: "",
          category: "",
        });
      }

      // Đóng modal và chuyển tab
      setShowSellerModal(false);
      setActiveTab("seller");
      router.refresh();
    } catch (error) {
      console.error("Submit seller error:", error);
      // Toast error đã được handle trong mutation
    }
  };

  /**
   * Hủy đăng ký seller
   */
  const handleCancelSeller = async () => {
    if (!confirm("Bạn có chắc muốn hủy đăng ký tài khoản Seller?")) return;

    try {
      await unRegisterSeller.mutateAsync({});

      // Reset seller data
      setSellerData({
        shopName: "",
        description: "",
        shopPhone: "",
        shopEmail: "",
        address: "",
        category: "",
      });

      toast.success("Đã hủy đăng ký seller");
      setActiveTab("profile");
      router.refresh();
    } catch (error) {
      console.error("Unregister seller error:", error);
    }
  };

  // ========================================
  // PAYMENT HANDLERS - WITH LIMITS
  // ========================================

  const handleAddPayment = () => {
    // Kiểm tra số lượng phương thức hiện có
    const hasPaypal = paymentMethods.some((p) => p.type === "paypal");
    const hasBank = paymentMethods.some((p) => p.type === "bank");

    // Nếu đã có cả 2 loại
    if (hasPaypal && hasBank) {
      toast.warning(
        "Bạn đã có đủ 2 phương thức thanh toán (PayPal cho USD và Ngân hàng cho VND). Vui lòng xóa một phương thức hiện tại nếu muốn thay đổi."
      );
      return;
    }

    setEditingPayment(null);

    // Tự động chọn loại còn thiếu
    const defaultType = hasBank ? "paypal" : "bank";

    setNewPayment({
      type: defaultType,
      bankName: "",
      accountNumber: "",
      accountName: "",
      isDefault: false,
    });

    // Hiển thị thông báo hướng dẫn
    if (hasBank) {
      toast.info("Bạn đang thêm PayPal cho giao dịch USD");
    } else if (hasPaypal) {
      toast.info("Bạn đang thêm Ngân hàng cho giao dịch VND");
    }

    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setNewPayment({ ...payment });
    setShowPaymentModal(true);
  };

  const handleSavePayment = () => {
    if (!newPayment.accountNumber) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra nếu đang thêm mới (không phải edit)
    if (!editingPayment) {
      const existingType = paymentMethods.find(
        (p) => p.type === newPayment.type
      );

      if (existingType) {
        const typeName = newPayment.type === "paypal" ? "PayPal" : "Ngân hàng";
        toast.error(
          `Bạn đã có phương thức ${typeName}. Mỗi loại chỉ được thêm 1 lần.`
        );
        return;
      }
    }

    const provider = newPayment.type === "paypal" ? "PAYPAL" : "PAYOS";
    const payload: any = {
      provider,
      receiverAccount: newPayment.accountNumber,
      receiverName: provider === "PAYPAL" ? null : newPayment.accountName,
      bankCode: newPayment.type === "bank" ? newPayment.bankName : null,
      isDefault: !!newPayment.isDefault,
    };

    savePaymentMutation.mutate(payload, {
      onSuccess: () => {
        const typeName =
          newPayment.type === "paypal" ? "PayPal (USD)" : "Ngân hàng (VND)";
        toast.success(`Đã lưu phương thức ${typeName} thành công`);
        setShowPaymentModal(false);
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Lưu phương thức thất bại");
      },
    });
  };

  const handleDeletePayment = (id: any) => {
    const deletingMethod = paymentMethods.find((p) => p.id === id);
    const typeName =
      deletingMethod?.type === "paypal" ? "PayPal (USD)" : "Ngân hàng (VND)";

    if (!confirm(`Bạn có muốn xóa phương thức thanh toán ${typeName}?`)) return;

    deletePaymentMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Đã xóa phương thức ${typeName}`);
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Xóa phương thức thất bại");
      },
    });
  };

  const handleSetDefaultPayment = (id: any) => {
    const updated = paymentMethods.map((p) => ({
      ...p,
      isDefault: p.id === id,
    }));
    setPaymentMethods(updated);
  };

  // ========================================
  // RENDER
  // ========================================

  // Loading State
  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 animate-spin text-primary" />
              <p className="text-base sm:text-lg font-medium text-foreground">
                Đang tải thông tin...
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (detailsError) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
          <Card className="border-destructive">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center py-6 sm:py-8">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-destructive" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  Không thể tải thông tin profile
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4">
                  Đã có lỗi xảy ra. Vui lòng thử lại sau.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  Tải lại trang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const localUser = userData ?? {
    name: "",
    email: "",
    phone: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    balance: 0,
    transactions: [],
  };

  const renderSecurityTab = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <ChangePasswordFrom />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">
            Tài khoản của tôi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList
            className={`grid w-full ${
              provider === "LOCAL" && userRole !== "admin"
                ? "grid-cols-4"
                : "grid-cols-3"
            } lg:w-auto lg:inline-flex h-auto p-1 bg-muted gap-1`}
          >
            <TabsTrigger
              value="profile"
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              <span className="inline">Hồ sơ</span>
            </TabsTrigger>
            {provider === "LOCAL" && (
              <TabsTrigger
                value="security"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
              >
                <span className="inline">Bảo mật</span>
              </TabsTrigger>
            )}
            <TabsTrigger
              value="billing"
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              <span className="inline">Thanh toán</span>
            </TabsTrigger>
            {canAccessSellerUI && (
              <TabsTrigger
                value="seller"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
              >
                <span className="inline truncate">
                  {isSeller ? "Cửa hàng" : "Seller"}
                </span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="mt-4 sm:mt-6">
            <ProfileTab
              userData={localUser}
              userRole={userRole}
              isSeller={isSeller}
              provider={provider}
              isUpdating={updateProfile.isPending}
              fileInputRef={fileInputRef}
              onUserDataChange={setUserData}
              onSaveProfile={handleSaveProfile}
              onChooseAvatar={onChooseAvatar}
              onAvatarSelected={onAvatarSelected}
              onCancel={() => {
                setUserData({
                  name: details?.fullname ?? "",
                  email: details?.email ?? "",
                  phone: details?.phone ?? "",
                  avatar: details?.avatar ?? localUser.avatar,
                  balance: 0,
                  transactions: [],
                });
              }}
            />
          </TabsContent>

          {provider === "LOCAL" && (
            <TabsContent value="security" className="mt-4 sm:mt-6">
              {renderSecurityTab()}
            </TabsContent>
          )}

          <TabsContent value="billing" className="mt-4 sm:mt-6">
            <BillingTab
              isSeller={isSeller}
              userRole={userRole}
              paymentMethods={paymentMethods}
              onAddPayment={handleAddPayment}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
              onSetDefaultPayment={handleSetDefaultPayment}
              onNavigateToSeller={() => setActiveTab("seller")}
            />
          </TabsContent>

          {canAccessSellerUI && (
            <TabsContent value="seller" className="mt-4 sm:mt-6">
              <SellerTab
                isSeller={isSeller}
                sellerData={sellerData}
                sellerStatus={sellerStatus}
                isCancelling={unRegisterSeller.isPending}
                onRegisterSeller={handleRegisterSeller}
                onCancelSeller={handleCancelSeller}
                onEditSeller={handleEditSeller}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Modal Seller với isEditMode */}
      <SellerRegistrationModal
        isOpen={showSellerModal}
        isEditMode={isEditingSellerMode}
        sellerData={sellerData}
        isSubmitting={
          isEditingSellerMode ? updateShop.isPending : registerSeller.isPending
        }
        onClose={() => setShowSellerModal(false)}
        onConfirm={handleSubmitSeller}
        onSellerDataChange={setSellerData}
      />

      {/* Modal Payment */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        isEditing={!!editingPayment}
        paymentData={newPayment}
        onClose={() => setShowPaymentModal(false)}
        onSave={handleSavePayment}
        onPaymentDataChange={setNewPayment}
      />
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CategoryService } from "@/services/category.service";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";

/* ================= TYPES ================= */

export type Category = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  productCount: number;
  feePercentage?: number | null;
  children?: Category[] | null;
};

export type CategoryFormData = {
  id?: string | number;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
};

/* ================= HELPERS ================= */

export const generateSlug = (name: string) => {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base}-${Date.now()}`;
};

/* ================= HOOK ================= */

export function useCategories() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    slug: "",
    description: "",
    parentId: null,
  });

  /* ================= QUERY ================= */

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await CategoryService.list();
      return res;
    },
    staleTime: 60_000,
  });

  /* ================= MUTATIONS ================= */

  const createMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: number | null }) =>
      CategoryService.setFee(id, value),
    onSuccess: () => {
      toast.success("Đã cập nhật phí danh mục");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Cập nhật phí thất bại");
    },
  });

  const create = useMutation({
    mutationFn: ({ payload }: { payload: any }) =>
      CategoryService.create(payload),
    onSuccess: () => {
      toast.success("Đã tạo danh mục");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Tạo danh mục thất bại");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: CategoryFormData;
    }) => CategoryService.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Cập nhật thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Xóa thất bại");
    },
  });

  /* ================= ACTIONS ================= */

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: null,
    });
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: null, // API chưa trả parentId
    });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: null,
    });
  };

  const onFormChange = (data: Partial<CategoryFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const saveCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const payload: CategoryFormData = {
      ...formData,
      slug: formData.slug?.trim() || generateSlug(formData.name),
      description: formData.description || "",
    };

    if (!editingId) {
      const token = Cookies.get(ACCESS_TOKEN);

      if (!!token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Tạo danh mục thành công!");
      } else {
        toast.warning("Bạn không có quyền truy cập!");
      }
      return;
    }

    await updateMutation.mutateAsync({
      id: editingId,
      payload,
    });
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  /* ================= RETURN ================= */

  return {
    // data
    categories,
    isLoading,
    error,
    create,
    // dialog
    open,
    setOpen,
    isEditing: editingId !== null,
    editingId,
    formData,

    // actions
    openCreate,
    openEdit,
    closeDialog,
    onFormChange,
    saveCategory,
    deleteCategory,
    refetch,

    // mutations
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

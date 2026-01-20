import { ArrowLeft, Share2, Star } from "lucide-react";
import Link from "next/link";
import ProductDetailPage from "@/components/features/product/ProductsDetals";

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const slug = atob(decodeURIComponent(hash));

  return <ProductDetailPage slug={slug} />;
}

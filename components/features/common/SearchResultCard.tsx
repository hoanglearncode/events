"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { SearchResult } from "./SearchResult";

interface SearchResultCardProps {
  result: SearchResult;
  onClick: () => void;
}

/**
 * Lấy ảnh đầu tiên từ schema (ưu tiên image field)
 * Hỗ trợ base64 và URL
 */
function getSchemaImage(result: any): string | null {
  const schema = result.schema;
  if (!schema?.schema || !schema?.data) return null;

  for (const block of schema.schema) {
    const imageField = block.fields?.find((f : any) => f.type === "image");
    if (!imageField) continue;

    const dataItem = schema.data.find((d : any) => d.frameId === block.id);
    if (!dataItem) continue;

    const value = dataItem.values?.[imageField.id];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

export function SearchResultCard({ result, onClick }: any) {
  const schemaImage = getSchemaImage(result);
  const thumbnail = schemaImage || result.meta.thumbnailUrl || null;

  const priceObj = result.meta.prices?.[0];
  const price = priceObj?.amount ?? null;
  const currency = priceObj?.currency ?? "";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-4 p-3 rounded-xl border border-border hover:bg-accent/5 hover:border-primary/30 transition-all duration-200 text-left group"
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {thumbnail ? (
          thumbnail.startsWith("data:image") ? (
            <img
              src={thumbnail}
              alt={result.meta.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <img
              src={thumbnail}
              alt={result.meta.name}
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-2xl font-bold text-primary/50">
              {result.meta.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {result.meta.name}
        </h4>

        {result.meta.seoDescription && (
          <p
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3"
            dangerouslySetInnerHTML={{ __html: result.meta.seoDescription }}
          />
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {result.meta.categoryName && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5">
              {result.meta.categoryName}
            </Badge>
          )}

          {price !== null && (
            <span className="text-xs font-bold text-primary">
              {price === 0
                ? "Miễn phí"
                : `${price.toLocaleString("vi-VN")} ${currency}`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

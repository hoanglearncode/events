import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const advertisementBanners = [
  {
    id: 1,
    title: "Khóa học IELTS",
    subtitle: "Cam kết đầu ra 7.0+",
    description: "Giảm 30% học phí - Tặng tài liệu độc quyền",
    image: "/mock/ads-1.jpg",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: "📚",
    cta: "Đăng ký ngay",
  },
  {
    id: 2,
    title: "Du học Úc 2026",
    subtitle: "Tư vấn miễn phí",
    description: "Hỗ trợ visa - Học bổng lên đến 50%",
    image: "/mock/ads-2.jpg",
    color: "from-purple-500/20 to-pink-500/20",
    icon: "✈️",
    cta: "Tìm hiểu thêm",
  },
  {
    id: 3,
    title: "Laptop sinh viên",
    subtitle: "Trả góp 0%",
    description: "Ưu đãi đặc biệt cho sinh viên",
    image: "/mock/ads-3.jpg",
    color: "from-green-500/20 to-emerald-500/20",
    icon: "💻",
    cta: "Xem ngay",
  },
];

export function Advertisement() {
  // Randomly select an advertisement banner
  const randomAd = advertisementBanners[Math.floor(Math.random() * advertisementBanners.length)];

  return (
    <Card className="hidden lg:block overflow-hidden border-border p-0">
      <div
        className={`relative w-full aspect-[3/4] bg-gradient-to-br ${randomAd.color}`}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={randomAd.image}
            alt={randomAd.title}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          {/* Top */}
          <div className="flex flex-col gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl">
              {randomAd.icon}
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold leading-tight">
                {randomAd.title}
              </h4>
              <p className="text-sm font-medium opacity-90">
                {randomAd.subtitle}
              </p>
            </div>
          </div>

          {/* Middle */}
          <p className="text-sm opacity-90 leading-relaxed">
            {randomAd.description}
          </p>

          {/* CTA */}
          <Button className="mt-4 bg-white text-black hover:bg-white/90">
            {randomAd.cta}
          </Button>
        </div>
      </div>
    </Card>
  );
}
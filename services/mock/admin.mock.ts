export const adminMock = {
  stats: {
    totalGmv: 0, // 1.25B VND
    commissionRevenue: 0, // 150M VND
    totalItems: 0,
    totalSold: 0,
    // trend percentages (MoM) for display
    totalGmvTrend: 0,
    commissionRevenueTrend: 0,
    totalItemsTrend: 0,
    totalSoldTrend: 0,
  },
  // Alerts / tasks for "Cần xử lý"
  alerts: [
    {
      id: 1,
      title: "Seller chờ duyệt",
      desc: "Đăng ký mới cần thẩm định",
      kind: "seller",
      href: "/admin/sellers",
    },
    {
      id: 2,
      title: "Sản phẩm chờ duyệt",
      desc: "Sản phẩm mới cần thẩm định",
      kind: "withdraw",
      href: "/admin/withdrawals",
    },
  ],
};

export default adminMock;

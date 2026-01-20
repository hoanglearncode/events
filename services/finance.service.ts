// import { api } from "@/services/apiClient";
// import { API_ENDPOINTS } from "@/shared/const/api";
// import type { ApiResponse } from "@/types/api";
// import type {
//   FinanceStats,
//   Transaction,
//   TransactionListResponse,
// } from "@/types/finance";

// /**
//  * Seller Finance Service
//  * Gọi API trực tiếp – dùng cho hooks, middleware, logic nghiệp vụ
//  */
// export class FinanceService {
//   /**
//    * Get seller finance statistics
//    */
//   static async getStats(): Promise<FinanceStats> {
//     const response = await api.get<FinanceStats>(
//       API_ENDPOINTS.SELLER_FINANCE.STATS
//     );

//     if (!response._success || !response._data) {
//       throw new Error(
//         typeof response._messages === "string"
//           ? response._messages
//           : "Không thể lấy thống kê tài chính"
//       );
//     }

//     return response._data;
//   }

//   /**
//    * Get transaction list
//    */
//   static async getTransactions(
//     page: number,
//     pageSize: number
//   ): Promise<TransactionListResponse> {
//     const response = await api.get<TransactionListResponse>(
//       API_ENDPOINTS.SELLER_FINANCE.TRANSACTIONS,
//       {
//         params: { page, pageSize },
//       }
//     );

//     if (!response._success || !response._data) {
//       throw new Error(
//         typeof response._messages === "string"
//           ? response._messages
//           : "Không thể lấy danh sách giao dịch"
//       );
//     }

//     return response._data;
//   }

//   /**
//    * Get transaction detail
//    */
//   static async getTransactionDetail(
//     transactionId: string
//   ): Promise<Transaction> {
//     const response = await api.get<Transaction>(
//       `${API_ENDPOINTS.SELLER_FINANCE.TRANSACTIONS}/${transactionId}`
//     );

//     if (!response._success || !response._data) {
//       throw new Error(
//         typeof response._messages === "string"
//           ? response._messages
//           : "Không thể lấy chi tiết giao dịch"
//       );
//     }

//     return response._data;
//   }

//   /**
//    * Withdraw money
//    */
//   static async withdraw(amount: number): Promise<{ message: string }> {
//     const response = await api.post<{ message: string }>(
//       API_ENDPOINTS.SELLER_FINANCE.WITHDRAW,
//       { amount }
//     );

//     if (!response._success || !response._data) {
//       throw new Error(
//         typeof response._messages === "string"
//           ? response._messages
//           : "Rút tiền thất bại"
//       );
//     }

//     return response._data;
//   }
// }

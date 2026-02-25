import { Tool } from "@/types/tool";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";


import { toast } from "sonner";

const toolsQueryKey = {
  all: ["tools"] as const,
  details: () => [...toolsQueryKey.all, "detail"] as const,
  buy: () => [...toolsQueryKey.all, "up"] as const,
};

export const useToolsData = () => {
  const queryClient = useQueryClient();
  // return {
  //   tools: MOCK_TOOLS,
  //   isLoading: false,
  // };
};

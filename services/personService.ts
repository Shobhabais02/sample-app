import { apiClient } from "../services/api";

export const fetchPersonChanges = async (page: number = 1) => {
  return await apiClient(`/person/changes?page=${page}`);
};

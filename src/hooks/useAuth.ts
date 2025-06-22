import { useAuth as useAuthFromContext } from '../components/AuthContext';

export function useAuth() {
  return useAuthFromContext();
}
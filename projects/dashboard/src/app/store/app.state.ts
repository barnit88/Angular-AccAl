export const STORE_NAME = 'userInfo';

export type mergedBy = {
  email: string;
  full_name: string;
  is_active?: boolean | null;
  is_admin?: boolean | null;
  role?: string | null;
};

export type mergeProfile = {
  email: string;
  mergedBy: mergedBy;
  merged_on: string;
  services: string[];
};

export type MergedUserInfo = {
  email: string;
  merged_profiles: mergeProfile[];
};

// Let's define an intial state of merged state

export const INITIAL_MERGED_STATE: MergedUserInfo = {
  email: '',
  merged_profiles: [],
};

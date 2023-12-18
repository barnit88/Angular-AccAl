export interface IntegrationModel {
  enabled: boolean;
  logo: string;
  name: string;
  slug: string;
  link?: string;
  faq?: string;
  homepage?: string;
}

export interface ServiceUserModel {
  id: string;
  is_admin: boolean;
  last_active: string;
  slug: string;
  index?: number;
}

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  full_name: string;
  google?: ServiceUserModel;
  slack?: ServiceUserModel;
  index?: number;
  [x: string]: any;
}

export interface CompanyAndUserInfo {
  user: User;
  company: Company;
}

export interface Company {
  domain: string;
  name: string;
  services: string[];
}

export interface User {
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  role: string;
}

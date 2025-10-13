import { ProductsSchema } from '@/lib/validations/index.t';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;


}
export type PagePropsSellerOverview = {
    reports : ReportsSeller
 }

export interface TopProducts {
    name: string;
    orders_count: number;
}
export interface ReportsSeller {
  totalProducts: number;
  totalOrders: number;
  topProducts: TopProducts[]
  totalOrdersDiterima: number;
  totalPendapatan: number;
  ProductscategoryCount: Record<string, number>;
  ProductsstatusCount: Record<string, number>;
  StatusOrdersCount: Record<string, number>;

  countsByDate: ChartDataType[];
}


export interface ChartDataType {
    date: string;
   
    orders?: number;
    revenue?: number;
    [key: string]: number; 
  }


export interface BreadcrumbItem {
    title: string;
    href: string;
}
export interface DataCard { 
    title: string;
    description: string;
    value: number | number;
    icon: LucideIcon;
   label?: string;
  }
  
export interface tabsLinktype{
    link: string
    name: string
  }
export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    whishlist_count?: number;
    order_count?: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
        roles : string[]
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface sidebarType {  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}






export interface OptionItem {
  value: string;
  label: string;
  icon: LucideIcon;
  subLabel?: string;
  description?: string;
  image?: string;
  [key: string]: string | undefined | LucideIcon;
  }


  export interface DataFile {
    mediaType: "image" | "video"
    webViewLink: string
}


export interface Filters {
    search?: string;
    status?: string[] | string;
    category?: string[] | string
    [key: string]: unknown;
}

// export interface DataCard { 
//     title: string;
//     description: string;
//     value: number;
//     icon: LucideIcon;
//    label?: string;
//   }
  

export interface PaginatedData {
  
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
     hasMore: boolean;
    [key: string]: unknown;
}


  
  export interface ProductResponse {
    status: boolean;
    message: string;
    data: ProductsSchema[];
    meta: Meta;
  }


export interface Meta {
    filters : Filters
    pagination : PaginatedData
}

export interface ApiResponse {
  status: boolean;
 
  message: string;
  meta?: Meta;
  data?: ProductsSchema[];
 
}


export type paramsProps = {
   params: { 
    page?: number; 
    perPage?: number; 
    search?: string; 
    order_by?: string; 
    status?: string | string[] 
    category?: string | string[] 
    free_shipping? : boolean
  } 
}

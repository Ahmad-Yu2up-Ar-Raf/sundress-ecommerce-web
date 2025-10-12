import { paramsProps, ProductResponse } from '@/types';
import axios from '@/lib/axios';
import { ProductsSchema } from '@/lib/validations/index.t';


export interface ApiResponse {
  status: boolean;
 
  message: string;

  data: ProductsSchema;
 
}

export type paramsPropsDetail = {
  
}

export const useProducts = () => {
  const getProducts = async ({ params } : paramsProps): Promise<ProductResponse> => {
    try {
      
      const { page = 1, perPage = 12, search, status  , category , free_shipping , order_by} = params;
      const res = await axios.get<ProductResponse>('/products', {
        params: {
          page,
          perPage,
            order_by: order_by ,
          search: search ?? undefined,
          status: Array.isArray(status) ? status.join(',') : status ?? undefined,
          category: Array.isArray(category) ? category.join(',') : category ?? undefined,
          free_shipping: free_shipping ?? false,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  };



  const getProductsDetail = async ({ id } : {id: number }): Promise<ApiResponse> => {
    try {
      
      // const { page = 1, perPage = 12, search, status  , category , free_shipping , order_by} = params;
      const res = await axios.get<ApiResponse>(`/products/${id}`);
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  };

  return  {
     getProducts ,
 getProductsDetail
   };
};
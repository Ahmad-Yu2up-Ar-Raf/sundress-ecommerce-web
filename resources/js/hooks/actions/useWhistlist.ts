// hooks/useWhistlist.ts
import axios from '@/lib/axios';
import { WhistlistSchema,  } from '@/lib/validations/index.t';
import { Meta } from "@/types";

interface ApiResponse {
  status: boolean;
  message: string;
  meta?: Meta;
  data?: WhistlistSchema[];
}


export const useWhistlist = () => {
  const getWhistlist = async (): Promise<ApiResponse | null> => {
    try {

      const response = await axios.get<ApiResponse>('/whistlist');

    
      console.log('full axios response:', response);
      console.log('response.data:', response.data);

      const payload = (response).data ?? (response);

      return payload as ApiResponse;
    } catch (error) {
      console.error('getWhistlist error:', error ?? error);
      return null;
    }
  };


 const addWhistlist = async ({EndPoint , data  } : {
  data: WhistlistSchema 
  EndPoint: string
 })  => {
    try {

      
      const response = await axios.post(EndPoint, data)

      
  
      
      // Redirect based on role

    return { success: true, message: 'Added successful!' , response }
    } catch (error) {
       return {
        success: false,
        message: error || 'Failed add whistlist',
        errors: error || {}
      }
    }
  }
  return { getWhistlist , addWhistlist };
};

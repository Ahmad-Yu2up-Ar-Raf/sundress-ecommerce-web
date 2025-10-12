'use client';


import { RequireRole } from "./require-role";






const MyShopProviders = ({ children }: { children: React.ReactNode }) => {



    return (
<>
    <RequireRole role="seller">

{children}
    </RequireRole>
</>
                       
    );
};

export default MyShopProviders;
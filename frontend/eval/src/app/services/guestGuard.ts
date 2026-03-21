// import { inject } from "@angular/core";
// import { CanActivateFn, Router } from "@angular/router";
// import { Supabase } from "./supabase/supabase";

// export const guestGuard: CanActivateFn = async (error) => {
//     const supabase = inject(Supabase)
//     const router = inject(Router)
    
//     const { data: { session } } = await supabase.supabase.auth.getSession()
    
//     if(session){
//         return router.createUrlTree(['./uploadResume'])
//     }
    
//     return true
// }
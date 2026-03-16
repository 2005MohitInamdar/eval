import { CanActivateFn, CanActivateChildFn, CanMatchFn, Router } from "@angular/router";
import { Supabase } from "./supabase/supabase";
import { inject } from "@angular/core";
import {take, map} from 'rxjs'

// export const authGuardcanMatch:CanMatchFn = (route, segments) => {
//     const supabaseService = inject(Supabase)
//     const router = inject(Router)

//     return supabaseService.currentUser.pipe(
//         take(1),
//         map(user => user? true: router.createUrlTree(['/auth/login']))
//     )
// }

// export const authGuardChild: CanActivateChildFn = (childRoute, state) => {
//     const supabaseService = inject(Supabase)
//     const router = inject(Router)

//     return supabaseService.currentUser.pipe(
//         take(1),
//         map(user => user? true: router.createUrlTree(['/auth/login']))
//     )
// }

export const authGuard: CanActivateFn = (route, state) => {
    const supabaseService = inject(Supabase)
    const router = inject(Router)

    return supabaseService.currentUser.pipe(
        take(1),
        map(user => user? true: router.createUrlTree(['/auth/login']))
    )
}
export interface User {
        id: string;
        is_suspended?: boolean;
        email?: string;
        picture?: string;
        full_name?: string;
        last_name?: string;
        created_on?: string;
        first_name?: string;
        last_signed_in?: string;
        total_sign_ins?: number;
        failed_sign_ins?: number;
    }
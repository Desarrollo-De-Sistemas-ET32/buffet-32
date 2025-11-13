import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

export function AccessDeniedAlert() {
    const hasShownToast = useRef(false);
    const [error] = useQueryState("error");

    useEffect(() => {
        if (error === "access_denied" && !hasShownToast.current && error) {
            toast.error("You don't have permission to access that page.");
            hasShownToast.current = true;
        } else if (error !== "access_denied") {
            hasShownToast.current = false;
        }
    }, [error]);

    return null;
} 
import { toast } from "./toast";

export const handleSuccess = (msg) => toast.success(msg);
export const handleError = (msg) => toast.error(msg);

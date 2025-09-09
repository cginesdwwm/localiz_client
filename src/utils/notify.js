import { toast } from "react-hot-toast";

const DEFAULT = {
  position: "top-center",
  duration: 6000,
};

const merge = (opts = {}) => ({ ...DEFAULT, ...opts });

export const notify = {
  success: (msg, opts = {}) => toast.success(msg, merge(opts)),
  error: (msg, opts = {}) => toast.error(msg, merge(opts)),
  custom: (fn, opts = {}) => toast((t) => fn(t), merge(opts)),
};

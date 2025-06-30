import { useEffect, useState } from "react";

export default function useExpansionState() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const callback = (value) => setIsExpanded(!!value);

    window?.electron?.onExpansionChange?.(callback);

    return () => {
      window?.electron?.removeExpansionChange?.(callback);
    };
  }, []);

  return { isExpanded, setIsExpanded };
}
import { useDispatch, useSelector } from "react-redux";

// Plain hooks re-exported from one place.
// Import these anywhere in your components instead of the raw
// react-redux hooks, so if you switch to TypeScript later you
// only need to update this one file.

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

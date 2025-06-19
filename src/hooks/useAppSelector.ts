import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/store"; // Define RootState if needed

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

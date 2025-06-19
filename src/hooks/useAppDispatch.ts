import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store"; // Define AppDispatch if needed

export const useAppDispatch = () => useDispatch<AppDispatch>();

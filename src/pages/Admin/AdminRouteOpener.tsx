import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

export function AdminRouteOpener() {
  const { openAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    openAdmin();
    navigate("/", { replace: true });
  }, [openAdmin, navigate]);

  return null;
}

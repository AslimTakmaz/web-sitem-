import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminContextValue {
  isOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        isOpen,
        openAdmin: () => setIsOpen(true),
        closeAdmin: () => setIsOpen(false),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin AdminProvider içinde kullanılmalıdır");
  }
  return context;
}

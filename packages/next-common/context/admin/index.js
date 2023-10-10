import React from "react";

const AdminContext = React.createContext();

export default AdminContext;

export function AdminProvider({ admins, children }) {
  return (
    <AdminContext.Provider value={admins}>{children}</AdminContext.Provider>
  );
}

export function useAdmins() {
  return React.useContext(AdminContext);
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminOverlay } from "./pages/Admin/Admin";
import { AdminRouteOpener } from "./pages/Admin/AdminRouteOpener";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SiteContentProvider>
          <AdminProvider>
            <Routes>
              <Route path="/admin" element={<AdminRouteOpener />} />
              <Route path="/*" element={<HomePage />} />
            </Routes>
            <AdminOverlay />
          </AdminProvider>
        </SiteContentProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

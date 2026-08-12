import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteContentProvider } from "./context/SiteContentContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminPage } from "./pages/Admin/Admin";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SiteContentProvider>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </SiteContentProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

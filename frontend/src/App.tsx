import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { wagmiConfig } from "./config";
import { SmartAccountProvider } from "./hooks/useSmartAccount";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from './pages/Home';
import AutoPayPage from "./pages/AutoPayPage"; // 👈 Import the new page

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <SmartAccountProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#0C0C0E] text-white">
              <NavBar />
              <main className="flex-grow">
                <Routes>
                  {/* 👇 Set the new AutoPayPage as the main route */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auto-pay" element={<AutoPayPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SmartAccountProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;

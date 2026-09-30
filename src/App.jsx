import CoffeeForm from "./components/CoffeeForm";
import Hero from "./components/Hero";
import History from "./components/History";
import Layout from "./components/Layout";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Stats from "./components/Stats";
import { useAuth } from "./context/AuthContext";

function App() {
  const { globalUser, isLoading, loadError } = useAuth();
  const isAuthenticated = globalUser;

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  );

  return (
    <>
      <Layout>
        <Hero />
        <CoffeeForm isAuthenticated={isAuthenticated} />
        {isAuthenticated && isLoading && <LoadingSkeleton />}
        {isAuthenticated && !isLoading && loadError && (
          <div role="alert">
            <p>❌ {loadError}</p>
            <button onClick={() => window.location.reload()}>
              <p>Retry</p>
            </button>
          </div>
        )}
        {isAuthenticated && !isLoading && !loadError && authenticatedContent}
      </Layout>
    </>
  );
}

export default App;

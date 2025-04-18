import CoffeeForm from "./components/CoffeeForm";
import Hero from "./components/Hero";
import History from "./components/History";
import Layout from "./components/Layout";
import Stats from "./components/Stats";

const isAuthenticated = false;

const authenticated = (
  <>
    <Stats />
    <History />
  </>
);

function App() {
  return (
    <>
      <Layout>
        <Hero />
        <CoffeeForm />
        {isAuthenticated && authenticated}
      </Layout>
    </>
  );
}

export default App;

export default function Layout(props) {
  const { children } = props;

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIEND</h1>
        <p>For Coffee Insatiates</p>
      </div>
      <button>
        <p>Sign up for free</p>
        <i class="fa-solid fa-mug-hot"></i>
      </button>
    </header>
  );

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Caffiend</span> was made by {" "}
        <a href="http://www.github.com/ilmanmdifa" target="_blank">
          ilmanmdifa
        </a>{" "}
        inspired by{" "}
        <a href="http://www.smoljames.com" target="_blank">
          smoljames
        </a>{" "}
        using the <a href="http://fantacss.smoljames.com">FantaCSS</a> design
        library.
      </p>
    </footer>
  );

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}

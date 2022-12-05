import "./Loader.css";

const Loader = ({ color }) => {
  return (
    <div className="lds-ellipsis">
      <div style={{ background: `${color || "#fff"}` }}></div>
      <div style={{ background: `${color || "#fff"}` }}></div>
      <div style={{ background: `${color || "#fff"}` }}></div>
      <div style={{ background: `${color || "#fff"}` }}></div>
    </div>
  );
};

export default Loader;

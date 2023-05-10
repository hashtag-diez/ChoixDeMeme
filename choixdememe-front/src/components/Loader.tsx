import "../loader.css";

const loader = ({ color }) => {
  const style = {
    "--var": color,
  } as React.CSSProperties;
  return (
    <div className="lds-ellipsis">
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>
  );
};
export default loader;

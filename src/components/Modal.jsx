import ReactDom from "react-dom";
export default function Modal(props) {
  const { children, handleCloseModal, compact } = props;
  return ReactDom.createPortal(
    <div className="modal-container">
      <button onClick={handleCloseModal} className="modal-underlay" />
      <div className={"modal-content" + (compact ? " modal-compact" : "")}>
        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}

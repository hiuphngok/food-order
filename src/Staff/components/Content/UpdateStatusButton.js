import '../css/style.css';

const statusCycle = {
  waiting: "cooking",
  cooking: "done",
  done: "done",
};

const UpdateStatusButton = ({ status, onChange }) => {
  const next = statusCycle[status];
  return (
    <button onClick={() => onChange?.(next)}>
      Trạng thái: {status} → {next !== status ? next : "✔"}
    </button>
  );
};
UpdateStatusButton.defaultProps = {
  status: "waiting",
  onChange: null,
};
export default UpdateStatusButton;
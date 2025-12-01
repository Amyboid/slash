type ToastProps = {
  msg: string;
};
export default function Toast({ msg }: ToastProps) {
  return (
    <div className="border absolute -bottom-12 p-2 rounded">{msg}</div>
  );
}

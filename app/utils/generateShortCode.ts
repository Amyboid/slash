export default function generateShortCode() {
  const length = Math.round(Math.random() * (9 - 6) + 6);
  const uuid = Math.random().toString(36).slice(-length);
  console.log(uuid);
  return uuid;
}
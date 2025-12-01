import ShortUniqueId from "short-unique-id";

const {randomUUID} = new ShortUniqueId({ length: 8 });
export default function generateShortCode() {
  return randomUUID();
}
import { Loader } from "lucide-react";


export default function SpinLoader({size = 30, strokeWidth = "3"}: {size?:number, strokeWidth?:string}) {
  return (
    <Loader size={size} strokeWidth={strokeWidth} className="ml-auto mr-auto animate-spin font-bold" />
  )
}
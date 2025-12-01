import React from "react";
import { Copy, Share2, BarChart2, Trash2, CornerDownRight } from "lucide-react";

interface UrlCardProps {
  code: string;
  hostname: string;
  redirectUrl?: string;
  handleDelete: (code: string) => void;
  classname?: string;
}

export default function UrlCard({
  code,
  hostname,
  redirectUrl,
  handleDelete,
  classname,
}: UrlCardProps) {
  const shortUrl = `${hostname}/${code}`;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(shortUrl);
  }

  return (
    <div
      className={`m-2 w-[250px] sm:w-[260px] h-[120px] sm:h-[150px] bg-[#1cceab] border sm:border-2 shadow-[3px_3px_#000] rounded p-4 sm:p-6 flex flex-col justify-between ${classname}`}
    >
      <div className="flex gap-3 text-gray-700 justify-end">
        <button
          onClick={copyToClipboard}
          className="transition cursor-pointer"
          title="Copy link"
        >
          <Copy size={16} strokeWidth={3}/>
        </button>
        <a
          href={`/code/${code}`}
          className="transition cursor-pointer"
          title="View Stats"
        >
          <BarChart2 size={16} strokeWidth={3}/>
        </a>

        <button
          onClick={() => handleDelete(code)}
          className="transition cursor-pointer"
          title="Delete"
        >
          <Trash2 size={16} strokeWidth={3}/>
        </button>
      </div>
      <div className="flex flex-col justify-between items-start gap-2">
          <a
            href={`/${code}`}
            target="_blank"
            className="text-sm font-semibold text-[hsl(251,94%,21%)] hover:underline"
          >
          {shortUrl}
          </a>

          {redirectUrl && (
            <a
              href={redirectUrl}
              target="_blank"
              className="text-xs sm:text-sm text-gray-700 hover:text-gray-700 flex items-center gap-2 w-full"
            >
              <CornerDownRight size={14} className="w-[10%]" /> <p className="w-[90%] text-nowrap overflow-hidden text-ellipsis">{redirectUrl}</p>
            </a>
          )}
      </div>
    </div>
  );
}

import React from "react";
import { WindowContent } from "../types/calendar";

interface WindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: WindowContent;
}

const WindowModal = ({ isOpen, onClose, content }: WindowModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[95vw] max-h-[95vh] p-0 flex items-center justify-center overflow-auto">
        {content ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center p-6 pb-2">
              <h2 className="font-header text-2xl text-[#E73B0D]">
                {content.title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="sr-only">Close</span>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              {content.imageUrl && (
                <img
                  src={content.imageUrl ?? undefined}
                  alt={content.title}
                  className="block max-w-full max-h-full object-contain mx-auto rounded"
                />
              )}
            </div>
            <div className="w-full px-6 pb-6">
              <p className="font-body mb-4 w-full text-center">
                {content.description}
              </p>
              {content.link && (
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-link text-[#E73B0D] hover:text-[#B32B00]"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="p-6">No content yet</p>
        )}
      </div>
    </div>
  );
};

export default WindowModal;

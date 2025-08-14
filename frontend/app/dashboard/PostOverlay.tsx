



interface PostOverlayProps {
  post: string;
  onClose: () => void;
  onPostToLinkedIn: () => void;
  isLoading: boolean;
  linkedinPostUrl?: string | null;
  linkedinApiResponse?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onSchedulePost?: (scheduledTime: string) => void;
  isScheduling?: boolean;
}


import React, { useState } from 'react';

const PostOverlay: React.FC<PostOverlayProps> = ({
  post,
  onClose,
  onPostToLinkedIn,
  isLoading,
  linkedinPostUrl,
  linkedinApiResponse,
  onRegenerate,
  isRegenerating,
  onSchedulePost,
  isScheduling
}) => {
  const [scheduledTime, setScheduledTime] = useState<string>("");
  if (!post) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-2xl w-full relative max-h-[60vh] min-h-[150px] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-600">Generated LinkedIn Post</h2>
        <div className="mb-6 flex-1">
          <div className="text-black whitespace-pre-line max-h-[35vh] overflow-auto p-2 border border-gray-200 rounded">
            {post}
          </div>
        </div>
        {linkedinPostUrl ? (
          <div className="mb-4">
            <a href={linkedinPostUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
              View your LinkedIn Post
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <button
                onClick={onPostToLinkedIn}
                disabled={isLoading || isRegenerating}
                className="btn-primary w-full md:w-auto"
              >
                {isLoading ? 'Posting...' : 'Post on LinkedIn'}
              </button>
              <button
                onClick={onRegenerate}
                className="btn-secondary w-full md:w-auto"
                disabled={isLoading || isRegenerating}
              >
                {isRegenerating ? 'Regenerating...' : 'Regenerate Post'}
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <input
                type="datetime-local"
                className="border border-gray-300 rounded px-2 py-1 text-black"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                disabled={isScheduling}
              />
              <button
                onClick={() => onSchedulePost && scheduledTime && onSchedulePost(scheduledTime)}
                disabled={!scheduledTime || isScheduling}
                className="btn-accent w-full md:w-auto"
              >
                {isScheduling ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </div>
          </>
        )}
        {linkedinApiResponse && null}
      </div>
    </div>
  );
}

export default PostOverlay;

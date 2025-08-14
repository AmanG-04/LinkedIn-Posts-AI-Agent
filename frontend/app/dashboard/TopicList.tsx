import React from 'react';

interface TopicListProps {
  topics: string[];
  isLoading: boolean;
  selectedNewsIndex: number | null;
  isNewsPostLoading: boolean;
  newsPosts: { [key: number]: string };
  onGenerate: (topic: string, idx: number) => void;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  isLoading,
  selectedNewsIndex,
  isNewsPostLoading,
  newsPosts,
  onGenerate,
}) => {
  return (
    <div className="mb-10">
  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-black">
        <span role="img" aria-label="news">📰</span> Available Topics
      </h2>
      {isLoading ? (
        <div className="text-gray-500">Loading topics...</div>
      ) : topics.length === 0 ? (
        <div className="text-gray-500">No topics available.</div>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic, idx) => (
            <li
              key={`topic-${idx}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <span className="font-semibold text-black">{topic}</span>
              <button
                onClick={() => onGenerate(topic, idx)}
                disabled={isNewsPostLoading && selectedNewsIndex === idx}
                className="btn-secondary mt-2"
              >
                {isNewsPostLoading && selectedNewsIndex === idx ? 'Generating...' : 'Generate Post'}
              </button>
              {selectedNewsIndex === idx && newsPosts[idx] && (
                <div className="mt-2 bg-gray-100 p-4 rounded">
                  <p className="text-black">{newsPosts[idx]}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicList;

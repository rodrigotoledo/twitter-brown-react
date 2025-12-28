import { usePosts } from "../context/usePosts";
import TweetCard from "./TweetCard";

import type { Post as Tweet } from "../context/PostsContext";

// ...existing code...

const SideBar = () => {
  const { latestTweets, isLoadingLatest } = usePosts();

  // Debug: veja o que está vindo do backend
  return (
    <div className="w-full p-4 md:border-r border-vscode-border overflow-y-auto bg-vscode-sidebar sidebar-scroll">
      <h2 className="text-xl font-semibold mb-4 text-vscode-text">
        Latest Tweets
      </h2>
      {isLoadingLatest ? (
        <p className="text-vscode-text-muted">Loading...</p>
      ) : (
        latestTweets?.map((tweet: Tweet) => (
          <TweetCard
            key={tweet.id}
            id={tweet.id}
            user={tweet.user}
            content={tweet.content}
            likes={tweet.likes}
            dislikes={tweet.dislikes}
            retweets={tweet.retweets}
            comments={tweet.comments}
            userName={tweet.userName}
            userFullName={tweet.userFullName}
            theme="sidebar"
            showComments={false}
          />
        ))
      )}
    </div>
  );
};

export default SideBar;

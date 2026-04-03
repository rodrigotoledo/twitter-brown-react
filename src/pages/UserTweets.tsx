import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MatrixLayout from "../components/MatrixLayout";
import PageHeading from "../components/PageHeading";
import TweetCard from "../components/TweetCard";
import TweetForm from "../components/TweetForm";
import { useUser } from "../context/UserContext";
import { API_URL } from "../lib/api";
import { feedQueryOptions } from "../lib/queryDefaults";

const fetchUserTweets = async (username: string) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_URL}/tweets/username/${username}`, { headers });
  if (!res.ok) throw new Error("Error fetching user tweets");
  const data = await res.json();
  return Array.isArray(data) ? data : data.tweets || [];
};

const UserTweets = () => {
  const { username } = useParams();
  const { user } = useUser();
  const isCurrentUser = user?.username === username;

  const {
    data: tweets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userTweetsByUsername", username],
    queryFn: () => fetchUserTweets(username!),
    ...feedQueryOptions,
  });

  return (
    <MatrixLayout>
      <div className="flex h-screen w-full flex-col text-vscode-text">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-5 sm:px-6 md:h-full">
          <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
          {username ? <PageHeading username={username} /> : null}
          {isCurrentUser && (
            <div className="sticky top-0 z-10 mb-4 rounded-2xl border border-vscode-border bg-vscode-sidebar/95 px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.35),0_0_1px_rgba(92,255,137,0.2)] backdrop-blur-sm">
              <TweetForm
                onPost={() => refetch()}
                onError={(err) => alert(err)}
              />
            </div>
          )}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2">
            {isLoading && (
              <p className="text-vscode-text-muted">Loading tweets...</p>
            )}
            {tweets &&
              tweets.map((tweet: any) => (
                <TweetCard
                  key={tweet.id}
                  id={tweet.id}
                  user={tweet.user}
                  userName={tweet.userName}
                  userFullName={tweet.userFullName}
                  content={tweet.content}
                  title={tweet.title}
                  tags={tweet.tags}
                  likes={tweet.likes}
                  dislikes={tweet.dislikes}
                  retweets={tweet.retweets}
                  comments={tweet.comments}
                />
              ))}
          </div>
          </div>
        </div>
      </div>
    </MatrixLayout>
  );
};

export default UserTweets;

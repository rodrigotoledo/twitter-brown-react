import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import TweetCard from "../components/TweetCard";
import TweetForm from "../components/TweetForm";
import { useUser } from "../context/UserContext";

import MatrixLayout from "../components/MatrixLayout";
import PageHeading from "../components/PageHeading";
import type { Post as Tweet } from "../context/PostsContext";
import { API_URL } from "../lib/api";
import { feedQueryOptions } from "../lib/queryDefaults";

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { username } = useParams();
  const isCurrentUser = !username || user?.username === username;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const usernameToFetch = username || user?.username;
  const {
    data: tweetsToShow,
    isLoading: loadingTweets,
    refetch,
  } = useQuery({
    queryKey: ["tweetsForHome", usernameToFetch],
    queryFn: () => fetchTweetsByUsername(usernameToFetch!),
    enabled: !!user && !!usernameToFetch,
    ...feedQueryOptions,
  });

  if (!user) return null;

  // Função para buscar tweets pelo username (sempre)
  const fetchTweetsByUsername = async (username: string) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${API_URL}/tweets/username/${username}`, {
      headers,
    });
    if (!res.ok) throw new Error("Error fetching user tweets");
    const data = await res.json();
    return (Array.isArray(data) ? data : data.tweets || []).map(
      (item: {
        id: number;
        creatorUsername: string;
        content: string;
        likes: number[] | number;
        dislikes: number[] | number;
        retweets: number[] | number;
        comments: { id: number; creatorUsername: string; content: string }[];
        createdAt: string;
      }) => ({
        id: String(item.id),
        user: item.creatorUsername,
        content: item.content,
        likes: item.likes,
        dislikes: item.dislikes,
        retweets: item.retweets,
        userName: item.creatorUsername,
        userFullName: undefined,
        comments: item.comments?.map((comment: { id: number; creatorUsername: string; content: string }) => ({
          id: String(comment.id),
          user: comment.creatorUsername,
          content: comment.content,
        })) || [],
        createdAt: item.createdAt,
      }),
    );
  };

  return (
    <MatrixLayout>
      <div className="flex h-screen w-full flex-col text-vscode-text">
        <div className="sticky top-0 z-30 border-b border-vscode-border bg-vscode-sidebar/90 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
            <TopBar />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
          <aside className="h-44 min-h-0 shrink-0 overflow-y-auto border-b border-vscode-border bg-vscode-sidebar/90 shadow-[inset_-1px_0_0_rgba(92,255,137,0.1)] backdrop-blur-sm md:h-full md:w-[min(100%,20rem)] md:border-b-0 md:border-r lg:w-80">
            <SideBar />
          </aside>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 md:h-full">
            <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
            {usernameToFetch ? (
              <PageHeading username={usernameToFetch} />
            ) : null}
            {isCurrentUser && (
              <div className="sticky top-0 z-10 mb-4 rounded-2xl border border-vscode-border bg-vscode-sidebar/95 px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.35),0_0_1px_rgba(92,255,137,0.2)] backdrop-blur-sm">
                <TweetForm
                  onPost={() => refetch()}
                  onError={(err) => alert(err)}
                />
              </div>
            )}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2">
              {loadingTweets && (
                <p className="text-vscode-text-muted">Loading tweets...</p>
              )}
              {Array.isArray(tweetsToShow) && tweetsToShow.length > 0
                ? tweetsToShow.map((tweet: Tweet) => (
                    <TweetCard
                      key={tweet.id}
                      id={tweet.id}
                      user={typeof tweet.user === 'string' ? tweet.user : tweet.userName || ''}
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
                  ))
                : !loadingTweets && (
                    <p className="rounded-xl border border-vscode-border bg-vscode-sidebar px-4 py-3 text-vscode-text-muted">
                      No tweets found.
                    </p>
                  )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </MatrixLayout>
  );
};

export default Home;

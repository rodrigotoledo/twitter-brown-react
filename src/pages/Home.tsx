import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import TweetForm from "../components/TweetForm";
import TweetCard from "../components/TweetCard";

import type { Post as Tweet } from "../context/PostsContext";
import MatrixLayout from "../components/MatrixLayout";

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
    refetchOnWindowFocus: true,
  });

  if (!user) return null;

  // Função para buscar tweets pelo username (sempre)
  const fetchTweetsByUsername = async (username: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${apiUrl}/tweets/username/${username}`, {
      headers,
    });
    if (!res.ok) throw new Error("Erro ao buscar tweets do usuário");
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
      <div className="flex flex-col h-screen w-full text-vscode-text">
        <div className="sticky top-0 z-20 bg-vscode-sidebar px-6 py-3 shadow-lg border-b border-vscode-border flex justify-between items-center">
          <TopBar />
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="h-40 overflow-y-auto border-b border-vscode-border md:h-full md:w-1/3 lg:w-1/4 md:border-b-0 md:border-r">
            <SideBar />
          </div>
          <div className="flex-1 flex flex-col md:h-full min-h-0 overflow-hidden p-4">
            <h1 className="text-lg font-semibold mb-2">
              Tweets de @{usernameToFetch}
            </h1>
            {isCurrentUser && (
              <div className="bg-vscode-sidebar px-4 py-3 shadow-md z-10 mb-4 rounded border border-vscode-border sticky top-0">
                <TweetForm
                  onPost={() => refetch()}
                  onError={(err) => alert(err)}
                />
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4">
              {loadingTweets && (
                <p className="text-vscode-text-muted">Carregando tweets...</p>
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
                    <p className="text-vscode-text-muted">
                      Nenhum tweet encontrado.
                    </p>
                  )}
            </div>
          </div>
        </div>
      </div>
    </MatrixLayout>
  );
};

export default Home;

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../context/UserContext';
import TweetCard from '../components/TweetCard';
import TweetForm from '../components/TweetForm';
import MatrixLayout from '../components/MatrixLayout';

const fetchUserTweets = async (username: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${apiUrl}/tweets/username/${username}`, { headers });
  if (!res.ok) throw new Error('Erro ao buscar tweets do usuário');
  const data = await res.json();
  return Array.isArray(data) ? data : data.tweets || [];
};

const UserTweets = () => {
  const { username } = useParams();
  const { user } = useUser();
  const isCurrentUser = user?.username === username;

  const { data: tweets, isLoading, refetch } = useQuery({
    queryKey: ['userTweetsByUsername', username],
    queryFn: () => fetchUserTweets(username!),
    refetchOnWindowFocus: true,
  });

  return (
    <MatrixLayout>
      <div className="flex flex-col h-screen w-full text-vscode-text">
        <div className="sticky top-0 z-20 bg-vscode-sidebar px-6 py-3 shadow-lg border-b border-vscode-border flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tweets de @{username}</h2>
        </div>
        <div className="flex-1 flex flex-col md:h-full min-h-0 overflow-hidden p-4">
          {isCurrentUser && (
            <div className="bg-vscode-sidebar px-4 py-3 shadow-md z-10 mb-4 rounded border border-vscode-border sticky top-0">
              <TweetForm onPost={refetch} onError={(err) => alert(err)} />
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4">
            {isLoading && <p className="text-vscode-text-muted">Carregando tweets...</p>}
            {tweets && tweets.map((tweet: any) => (
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
    </MatrixLayout>
  );
};

export default UserTweets;

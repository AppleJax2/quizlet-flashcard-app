import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  lastStudied?: string;
  averageConfidence?: number;
  createdAt: string;
  updatedAt: string;
}

interface StudyStats {
  totalCards: number;
  totalSets: number;
  cardsStudiedToday: number;
  averageConfidence: number;
  studyStreak: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent' | 'needReview'>('all');
  const [sortBy, setSortBy] = useState<'lastStudied' | 'confidence' | 'created'>('lastStudied');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [setsResponse, statsResponse] = await Promise.all([
          axios.get<FlashcardSet[]>('/api/flashcard-sets'),
          axios.get<StudyStats>('/api/study-stats')
        ]);

        setSets(setsResponse.data);
        setStats(statsResponse.data);
      } catch (err) {
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate, showToast]);

  const handleCreateSet = () => {
    navigate('/flashcards/create');
  };

  const handleStudySet = (id: string) => {
    navigate(`/study/${id}`);
  };

  const handleEditSet = (id: string) => {
    navigate(`/flashcards/${id}/edit`);
  };

  const handleDeleteSet = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this flashcard set?')) {
      return;
    }

    try {
      await axios.delete(`/api/flashcard-sets/${id}`);
      setSets((prev) => prev.filter((set) => set.id !== id));
      showToast('Flashcard set deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete flashcard set', 'error');
    }
  };

  const filteredSets = sets.filter((set) => {
    switch (filter) {
      case 'recent':
        return new Date(set.lastStudied || 0) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'needReview':
        return (set.averageConfidence || 0) < 3;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'lastStudied':
        return new Date(b.lastStudied || 0).getTime() - new Date(a.lastStudied || 0).getTime();
      case 'confidence':
        return (b.averageConfidence || 0) - (a.averageConfidence || 0);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track your progress and manage your flashcard sets
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sets</h3>
              <p className="mt-1 text-2xl font-semibold text-primary-500">{stats.totalSets}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cards</h3>
              <p className="mt-1 text-2xl font-semibold text-primary-500">{stats.totalCards}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Studied Today</h3>
              <p className="mt-1 text-2xl font-semibold text-primary-500">{stats.cardsStudiedToday}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Confidence</h3>
              <p className="mt-1 text-2xl font-semibold text-primary-500">
                {stats.averageConfidence.toFixed(1)}/5
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Streak</h3>
              <p className="mt-1 text-2xl font-semibold text-primary-500">
                {stats.studyStreak} days 🔥
              </p>
            </Card>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Sets</option>
              <option value="recent">Recently Studied</option>
              <option value="needReview">Needs Review</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="lastStudied">Last Studied</option>
              <option value="confidence">Confidence</option>
              <option value="created">Created Date</option>
            </select>
          </div>
          <Button
            onClick={handleCreateSet}
            variant="primary"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create New Set
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => (
            <Card key={set.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{set.title}</h3>
                  {set.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{set.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSet(set.id)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSet(set.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cards</p>
                  <p className="font-medium text-gray-900 dark:text-white">{set.cardCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Confidence</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {set.averageConfidence ? `${set.averageConfidence.toFixed(1)}/5` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last studied: {set.lastStudied ? new Date(set.lastStudied).toLocaleDateString() : 'Never'}
                </p>
              </div>

              <Button
                onClick={() => handleStudySet(set.id)}
                variant="outline"
                className="w-full mt-4"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              >
                Study Now
              </Button>
            </Card>
          ))}
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No flashcard sets found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {filter === 'all'
                ? "You haven't created any flashcard sets yet."
                : filter === 'recent'
                ? "You haven't studied any sets in the past week."
                : "No sets need review at the moment."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPage; 
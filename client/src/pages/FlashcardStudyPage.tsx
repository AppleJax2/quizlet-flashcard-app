import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import FlashcardSet from '../components/flashcards/FlashcardSet';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  confidence?: number;
}

interface FlashcardSetData {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

const FlashcardStudyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSetData | null>(null);
  const [studyStats, setStudyStats] = useState({
    cardsReviewed: 0,
    averageConfidence: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/study/${id}` } });
      return;
    }

    const fetchFlashcardSet = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<FlashcardSetData>(`/api/flashcard-sets/${id}`);
        setFlashcardSet(response.data);
      } catch (err) {
        setError('Failed to load flashcard set. Please try again later.');
        showToast('Failed to load flashcard set', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [id, isAuthenticated, navigate, showToast]);

  const handleEdit = async (cardId: string) => {
    navigate(`/flashcards/${id}/edit/${cardId}`);
  };

  const handleDelete = async (cardId: string) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }

    try {
      await axios.delete(`/api/flashcards/${cardId}`);
      setFlashcardSet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          flashcards: prev.flashcards.filter((card) => card.id !== cardId),
        };
      });
      showToast('Flashcard deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete flashcard', 'error');
    }
  };

  const handleConfidenceUpdate = async (cardId: string, confidence: number) => {
    try {
      await axios.post(`/api/flashcards/${cardId}/review`, { confidence });
      setStudyStats((prev) => ({
        cardsReviewed: prev.cardsReviewed + 1,
        averageConfidence: (prev.averageConfidence * prev.cardsReviewed + confidence) / (prev.cardsReviewed + 1),
      }));
    } catch (err) {
      showToast('Failed to update confidence level', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="large" />
      </div>
    );
  }

  if (error || !flashcardSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Flashcard set not found'}
        </h2>
        <Button onClick={() => navigate('/flashcards')} variant="primary">
          Back to Flashcards
        </Button>
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
      <div className="max-w-4xl mx-auto">
        {studyStats.cardsReviewed > 0 && (
          <div className="mb-8 p-4 bg-white dark:bg-dark-800 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Study Progress
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cards Reviewed</p>
                <p className="text-2xl font-bold text-primary-500">
                  {studyStats.cardsReviewed}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Confidence</p>
                <p className="text-2xl font-bold text-primary-500">
                  {studyStats.averageConfidence.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
        )}

        <FlashcardSet
          title={flashcardSet.title}
          description={flashcardSet.description}
          flashcards={flashcardSet.flashcards}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfidenceUpdate={handleConfidenceUpdate}
        />

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate('/flashcards')}
            variant="outline"
            className="mr-4"
          >
            Back to Sets
          </Button>
          <Button
            onClick={() => navigate(`/flashcards/${id}/edit`)}
            variant="primary"
          >
            Edit Set
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlashcardStudyPage; 
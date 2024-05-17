import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

export default function HomePage() {
    const user = useSelector(state => state.user);
    const isLoggin = useSelector(state => state.isLoggin);

    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCommentId, setCurrentCommentId] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:4444/comments');
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4444/comment/${id}`);
            fetchComments();
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            if (isEditing) {
                await handlePatch(currentCommentId, commentContent);
                setIsEditing(false);
                setCurrentCommentId(null);
            } else {
                await axios.post('http://localhost:4444/comment', { userName: user.user.username, content: commentContent });
            }
            setCommentContent('');
            fetchComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handlePatch = async (id, content) => {
        try {
            await axios.patch(`http://localhost:4444/comment/${id}`, { userName: user.user.username, content });
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditClick = (comment) => {
        setIsEditing(true);
        setCurrentCommentId(comment._id);
        setCommentContent(comment.content);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="chat-container">
            {isLoggin.isLoggin ? (
                <div className="logged-in">
                    <p className="welcome-message">Привет, {user.user.username}! 😊</p>
                    <textarea
                        className="comment-input"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Напишите сообщение... ✍️"
                    />
                    <button className="submit-button" onClick={handleCommentSubmit}>
                        {isEditing ? 'Обновить ✏️' : 'Отправить 📤'}
                    </button>
                    <div className="comments-section">
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <div className="content">
                                    <p className="user-name">{comment.userName} 🗣️</p>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                                {comment.userName === user.user.username ? (
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            onClick={() => handleDelete(comment._id)}
                                            className="delete-icon"
                                            title="Удалить 🗑️"
                                        />
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            onClick={() => handleEditClick(comment)}
                                            className="edit-icon"
                                            title="Редактировать ✏️"
                                        />
                                    </div>
                                ) : ''}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h2 style={{ color: 'white' }}>Чтобы писать в чат, вам необходимо авторизироваться 🔒</h2>
            )}
        </div>
    );
}

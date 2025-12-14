import React, { useState } from 'react';
import { tasksAPI, Task } from '../services/api';
import '../styles/TaskDetailModal.css';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdated: (updated: Task) => void;
}

const TaskDetailModal: React.FC<Props> = ({ task, onClose, onUpdated }) => {
  const [link, setLink] = useState<string>(task.submissionLink || '');
  const [saving, setSaving] = useState(false);
  const isSubmitted = !!task.submitted;

  // 1. CHECK IF CURRENT USER IS THE ASSIGNEE
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAssignee = currentUser?.userId === task.assignedUserId;

  const handleSubmit = async () => {
    if (!link) {
      alert('Please provide a submission link');
      return;
    }
    try {
      setSaving(true);
      const updated = await tasksAPI.submitTask(task.id, link);
      onUpdated(updated);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to submit task');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubmit = async () => {
    try {
      setSaving(true);
      const updated = await tasksAPI.unsubmitTask(task.id);
      onUpdated(updated);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to unsubmit task');
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Task Details</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div style={{ marginBottom: 12 }}>
              <strong>{task.taskName}</strong>
              <div style={{ color: '#666' }}>{task.description || 'No description'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><strong>Status:</strong> {task.status}</div>
              <div><strong>Priority:</strong> {task.priority}</div>
              <div><strong>Start:</strong> {task.startDate || 'N/A'}</div>
              <div><strong>Due:</strong> {task.dueDate || 'N/A'}</div>
            </div>

            {/* 2. DISABLE INPUT IF NOT ASSIGNEE */}
            <label htmlFor="submissionLink"><strong>Submission Link</strong></label>
            <input
                id="submissionLink"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={isAssignee ? "https://..." : "Only the assigned member can submit this task."}
                disabled={!isAssignee || isSubmitted} // Disabled if not assignee OR already submitted
                style={{ width: '100%', padding: '8px', marginTop: 6, backgroundColor: isAssignee ? '#fff' : '#f5f5f5' }}
            />

            {isSubmitted && task.submittedAt && (
                <div style={{ marginTop: 8, color: '#4caf50' }}>Submitted at: {new Date(task.submittedAt).toLocaleString()}</div>
            )}

            {!isAssignee && (
                <div style={{ marginTop: 8, fontSize: '12px', color: '#f44336' }}>
                  Viewing Mode: Only <strong>{task.assignedUserName}</strong> can update this task.
                </div>
            )}
          </div>

          <div className="modal-footer">
            {/* 3. HIDE ACTION BUTTONS IF NOT ASSIGNEE */}
            {isAssignee && (
                !isSubmitted ? (
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>Submit</button>
                ) : (
                    <button className="btn btn-secondary" onClick={handleUnsubmit} disabled={saving}>Unsubmit</button>
                )
            )}
            <button className="btn" onClick={onClose} disabled={saving}>Close</button>
          </div>
        </div>
      </div>
  );
};

export default TaskDetailModal;
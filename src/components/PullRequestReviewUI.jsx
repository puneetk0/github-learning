import React, { useState } from 'react';
import { GitPullRequest, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

export default function PullRequestReviewUI() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('pending'); // pending, approved, changes_requested

  const codeDiff = [
    { line: 45, type: 'context', content: '  const session = await getSession();' },
    { line: 46, type: 'removed', content: '- const user = db.findUser(session.userId);' },
    { line: 47, type: 'added', content: '+ const user = await db.findUser(session.userId);' },
    { line: 48, type: 'added', content: '+ if (!user) throw new AuthError();' },
    { line: 49, type: 'context', content: '  return user;' }
  ];

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), text: newComment, author: 'You' }]);
    setNewComment('');
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header" style={{ background: '#161b22', borderBottom: '1px solid #30363d', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GitPullRequest size={24} color={status === 'approved' ? '#238636' : status === 'changes_requested' ? '#f85149' : '#8957e5'} />
          <div>
            <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '18px' }}>feat(auth): fix session vulnerability <span style={{ color: '#8b949e', fontWeight: 'normal' }}>#142</span></h3>
            <div style={{ color: '#8b949e', fontSize: '13px', marginTop: '4px' }}>
              <span style={{ color: '#58a6ff', fontWeight: 'bold' }}>alice-dev</span> wants to merge 1 commit into <code>main</code> from <code>feature/fix-auth</code>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ background: 'var(--bg2)', padding: '24px', color: '#c9d1d9' }}>
        
        {/* Diff Viewer */}
        <div style={{ border: '1px solid #30363d', borderRadius: '6px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ background: '#161b22', padding: '8px 16px', borderBottom: '1px solid #30363d', fontSize: '13px', color: '#8b949e', display: 'flex', justifyContent: 'space-between' }}>
            <span>src/auth/session.js</span>
            <span style={{ color: '#58a6ff' }}>View file</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.5 }}>
            {codeDiff.map((line, idx) => (
              <div key={idx} style={{ 
                display: 'flex',
                background: line.type === 'added' ? 'rgba(46, 160, 67, 0.15)' : line.type === 'removed' ? 'rgba(248, 81, 73, 0.15)' : 'transparent'
              }}>
                <div style={{ width: '40px', padding: '0 8px', textAlign: 'right', color: '#6e7681', userSelect: 'none', borderRight: '1px solid #30363d' }}>
                  {line.line}
                </div>
                <div style={{ width: '20px', textAlign: 'center', color: line.type === 'added' ? '#3fb950' : line.type === 'removed' ? '#f85149' : 'transparent' }}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </div>
                <div style={{ padding: '0 8px', whiteSpace: 'pre-wrap' }}>
                  {line.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Comments */}
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#238636', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Y</div>
              <div style={{ flex: 1, border: '1px solid #30363d', borderRadius: '6px', background: '#161b22', padding: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>{comment.author}</div>
                <div style={{ fontSize: '14px' }}>{comment.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment / Review Form */}
        <div style={{ border: '1px solid #30363d', borderRadius: '6px', background: '#161b22', padding: '16px' }}>
          <form onSubmit={handleAddComment}>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment (e.g., 'nit: we should also catch the database error here')"
              style={{ width: '100%', height: '80px', background: 'var(--bg2)', border: '1px solid #30363d', borderRadius: '6px', padding: '8px', color: '#c9d1d9', fontFamily: 'inherit', resize: 'vertical', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="submit" className="btn" style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9' }} disabled={!newComment.trim()}>
                Comment
              </button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setStatus('changes_requested')} style={{ background: status === 'changes_requested' ? '#f85149' : '#21262d', border: '1px solid #30363d', color: status === 'changes_requested' ? '#fff' : '#c9d1d9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <XCircle size={16} /> Request Changes
                </button>
                <button type="button" onClick={() => setStatus('approved')} style={{ background: status === 'approved' ? '#238636' : '#21262d', border: '1px solid #30363d', color: status === 'approved' ? '#fff' : '#3fb950', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Approve
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { CodeReviewItem } from '../../types';

export const CodeReviewLab = React.memo(({ reviews, onApprove }: { reviews: CodeReviewItem[], onApprove: (id: string, directiveId?: string) => void; }) => (
    <div className="lab-container code-review"><h1 className="lab-header">Code Review</h1><ul className="review-list">{reviews.map(item => (<li key={item.id} className={`review-item status-${item.status.toLowerCase()}`}><span className="review-status">{item.status}</span><span className="review-title">{item.title}</span><span className="review-author">by {item.author}</span> {item.status === 'Open' && (<button className="approve-button" onClick={() => onApprove(item.id, item.directiveId)}>Approve</button>)}</li>))}</ul></div>
));

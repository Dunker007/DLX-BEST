import React, { useState, useMemo } from 'react';
import { KnowledgeFile } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const KnowledgeBaseLab = React.memo(({ files }: { files: KnowledgeFile[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFiles = useMemo(() => files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())), [files, searchTerm]);
    return (<div className="lab-container"><h1 className="lab-header">Knowledge Base</h1><div className="kb-grid"><HubWidget title="Knowledge Corpus"><p>Vector DB: Online & Synced</p><input type="text" placeholder="Perform semantic search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><button>Search</button></HubWidget><HubWidget title="Embedding Pipeline"><ul className="file-list">{filteredFiles.map(f => <li key={f.id} className={`file-status-${f.embeddingStatus?.replace('.', '')}`} >{f.name} - <strong>{f.embeddingStatus}</strong></li>)}</ul></HubWidget></div></div>);
});

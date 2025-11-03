import React, { useMemo } from 'react';
import { LabId, Directive, CodeReviewItem, DirectivePriority, DirectiveStatus, DeploymentStatus } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const AgentBriefingWidget = ({ activeLab, directives, codeReviewItems }: { activeLab: LabId; directives: Directive[], codeReviewItems: CodeReviewItem[] }) => {
    const briefingText = useMemo(() => {
        switch (activeLab) {
            case LabId.Strategy:
                const highPriority = directives.find(d => d.priority === DirectivePriority.High && d.status === DirectiveStatus.Pending);
                if (highPriority) return `High priority directive '${highPriority.title}' is pending. Consider escalating or deploying.`;
                return 'All high-priority directives are actioned. Focus on developing visionary concepts in the Mind Map.';
            // FIX: Replaced non-existent `LabId.CodeReview` and `LabId.Staging` with `LabId.Deployment` and merged the logic.
            case LabId.Deployment:
                const openPRs = codeReviewItems.filter(pr => pr.status === 'Open');
                if (openPRs.length > 0) return `There ${openPRs.length > 1 ? 'are' : 'is'} ${openPRs.length} open pull request${openPRs.length > 1 ? 's' : ''} awaiting your approval to proceed with deployment.`;
                
                const deployed = directives.find(d => d.deploymentStatus === DeploymentStatus.Deployed);
                if (deployed) return `Deployment of '${deployed.title}' is complete. Monitor performance and logs.`;
                
                const inReview = directives.find(d => d.deploymentStatus === DeploymentStatus.InReview);
                if (inReview) return `Project '${inReview.title}' is awaiting approval in Code Review before it can be deployed to Staging.`;

                return 'No active deployments. Initiate a new deployment from the Strategy Command lab.';
            default: return 'System nominal. Knowledge Agent is monitoring for contextual events.';
        }
    }, [activeLab, directives, codeReviewItems]);
    return <HubWidget title="Knowledge Agent Briefing" className="agent-briefing-widget"><p className="briefing-text">{briefingText}</p></HubWidget>;
};

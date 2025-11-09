import React from 'react';

// Simple HTML escaper
const escapeHtml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// A simple and safer markdown renderer
export const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const safeText = escapeHtml(text);

    const html = safeText
        .replace(/^#### (.*$)/gim, '<h4 class="text-md font-semibold text-text-accent mb-2 mt-4">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-green-bright mb-2 mt-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-green-bright mb-3 mt-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-green-bright mb-4 mt-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-accent">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-bg-primary text-green-primary rounded px-1 py-0.5 font-mono text-sm">$1</code>')
        .replace(/(?:(?:^-|\*)\s.*(?:\n|$))+/gm, (match) => {
            const items = match.trim().split('\n').map(item => 
                `<li class="list-disc ml-5">${item.replace(/^(-|\*)\s/, '').trim()}</li>`
            ).join('');
            return `<ul class="mb-4 space-y-1">${items}</ul>`;
        })
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none prose-p:text-text-primary prose-li:text-text-primary" dangerouslySetInnerHTML={{ __html: html }} />;
};

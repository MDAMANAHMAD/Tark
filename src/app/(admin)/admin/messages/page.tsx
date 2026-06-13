'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Clock, Eye, AlertCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRowClick = (msg: Message) => {
    setSelectedMessage(msg);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Inquiries</h1>
        <p className="text-sm text-slate-500 mt-1">View form submissions from the contact page</p>
      </header>

      {/* Message index grid */}
      <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading contact submissions...</div>
        ) : messages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Sent Date</th>
                  <th className="px-6 py-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {messages.map((msg) => (
                  <tr 
                    key={msg._id} 
                    onClick={() => handleRowClick(msg)}
                    className="hover:bg-slate-100/40 dark:hover:bg-slate-950/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{msg.name}</p>
                      <p className="text-xxs text-slate-400 font-mono mt-0.5">{msg.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {msg.subject}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[280px] truncate text-slate-500 dark:text-slate-400" title={msg.message}>
                        {msg.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(msg.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(msg);
                        }}
                        className="inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                        title="Read message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No messages received yet.</p>
          </div>
        )}
      </div>

      {/* Message detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Inquiry Details"
        footer={
          <button
            onClick={() => setDetailModalOpen(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg"
          >
            Close Inquiry
          </button>
        }
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-slate-400 font-bold block uppercase">From</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMessage.name}</span>
                <span className="text-slate-500 block font-mono">{selectedMessage.email}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold block uppercase">Date Received</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase block">Subject</span>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedMessage.subject}</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs text-slate-400 font-bold uppercase block">Message Body</span>
              <p className="text-sm bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

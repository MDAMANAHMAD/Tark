'use client';

import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Code, Image as ImageIcon, Link as LinkIcon, 
  Undo, Redo 
} from 'lucide-react';

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-4 shadow-md mx-auto block',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-lg my-6 shadow-md max-w-2xl mx-auto block',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base dark:prose-invert focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-b-lg text-slate-800 dark:text-slate-250',
      },
    },
  });

  if (!editor) return null;

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('Enter the URL link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please check your config.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const insertImageUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertYoutube = () => {
    const url = window.prompt('Enter YouTube video URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  // Button helper
  const ToolbarBtn = ({ 
    active, onClick, disabled = false, children, title 
  }: { 
    active?: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode; title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 transition-colors ${
        active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : ''
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full flex flex-col">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-950 border border-b-0 border-slate-300 dark:border-slate-800 rounded-t-lg items-center">
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strike"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-slate-350 dark:bg-slate-800 mx-1" />

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-slate-350 dark:bg-slate-800 mx-1" />

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-slate-350 dark:bg-slate-800 mx-1" />

        {/* Media & Link Group */}
        <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-900/60 p-0.5 rounded-lg border border-slate-300/60 dark:border-slate-800/80">
          <ToolbarBtn 
            onClick={toggleLink}
            active={editor.isActive('link')}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-450" />
          </ToolbarBtn>

          <ToolbarBtn 
            onClick={handleImageUploadClick}
            disabled={isUploading}
            title={isUploading ? 'Uploading...' : 'Upload Image File'}
          >
            <ImageIcon className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isUploading ? 'animate-pulse' : ''}`} />
          </ToolbarBtn>

          <ToolbarBtn 
            onClick={insertImageUrl}
            title="Insert Image from URL"
          >
            <span className="relative inline-flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full text-[6px] font-extrabold w-2.5 h-2.5 flex items-center justify-center border border-white dark:border-slate-900">U</span>
            </span>
          </ToolbarBtn>

          <ToolbarBtn 
            onClick={insertYoutube}
            title="Insert YouTube Video"
          >
            <YoutubeIcon className="w-4 h-4 text-rose-500" />
          </ToolbarBtn>
        </div>

        <span className="w-px h-5 bg-slate-355 dark:bg-slate-800 mx-1" />

        <ToolbarBtn 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarBtn>

        <ToolbarBtn 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
      
      {/* Dynamic inline styles for Editor elements to make ProseMirror render nicely without @tailwindcss/typography */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.625;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #475569;
        }
        .dark .ProseMirror blockquote {
          color: #94a3b8;
        }
        .ProseMirror pre {
          background-color: #0f172a;
          color: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          margin: 1.5rem 0;
        }
        .ProseMirror code {
          background-color: #f1f5f9;
          color: #0f172a;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: monospace;
        }
        .dark .ProseMirror code {
          background-color: #1e293b;
          color: #f1f5f9;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .dark .ProseMirror a {
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
